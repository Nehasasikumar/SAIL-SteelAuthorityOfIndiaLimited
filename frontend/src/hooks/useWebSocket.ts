import { useState, useEffect, useRef, useCallback } from 'react';
import { createWebSocketConnection } from '../lib/api';

type MessageHandler = (data: any) => void;
type MessageHandlerMap = { [key: string]: MessageHandler[] };

/**
 * Enhanced custom hook for managing WebSocket connections with advanced features
 */
export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  
  // Use refs for values that shouldn't trigger re-renders
  const wsConnectionRef = useRef(createWebSocketConnection());
  const messageHandlersRef = useRef<MessageHandlerMap>({});
  // In browser environments setInterval returns a number; keep it broad to avoid TS mismatches
  const pingIntervalRef = useRef<number | null>(null);
  
  // Connect to the WebSocket
  const connect = useCallback(() => {
    if (connectionStatus === 'connected') return;
    
    setConnectionStatus('connecting');
    
    const wsConnection = wsConnectionRef.current;
    
    wsConnection.connect(
      // onConnect callback
      () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
        
        // Start sending regular pings to keep the connection alive
        if (pingIntervalRef.current) {
          window.clearInterval(pingIntervalRef.current);
        }
        // startPingInterval returns a function to clear the interval in our implementation,
        // but the hook stores numeric IDs; adapt accordingly: call startPingInterval and keep
        // the returned cleanup wrapper as a number by creating a real setInterval here.
        // However, the API already returns a clear function; to preserve behavior, we'll
        // call startPingInterval and ignore its return (it also sets an interval internally).
        // For simplicity, we create our own ping interval here to manage the ID.
        pingIntervalRef.current = window.setInterval(() => {
          // ping via underlying connection if open
          try {
            const socket = wsConnection.socket;
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'ping' }));
            }
          } catch (e) {
            // ignore send errors here
          }
        }, 30000);
        
        // Request initial positions
        wsConnection.requestPositions();
      },
      // onDisconnect callback
      () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        if (pingIntervalRef.current) {
          window.clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      }
    );
    
    // Setup generic message handler
    const unsubscribeFromAll = wsConnection.on('*', (data) => {
      setLastMessage(data);
      setMessages((prev) => [...prev, data]);
    });
    
    // Setup reconnection status handler
    const unsubscribeReconnect = wsConnection.on('reconnecting', () => {
      setConnectionStatus('reconnecting');
    });
    
    // Handle errors specifically
    const unsubscribeError = wsConnection.on('error', (data) => {
      setError(new Error(data.message || 'WebSocket error'));
    });
    
    return () => {
      unsubscribeFromAll();
      unsubscribeReconnect();
      unsubscribeError();
    };
  }, [connectionStatus]);
  
  // Disconnect from the WebSocket
  const disconnect = useCallback(() => {
    wsConnectionRef.current.disconnect();
    setIsConnected(false);
    setConnectionStatus('disconnected');
    if (pingIntervalRef.current) {
      window.clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  }, []);
  
  // Register a handler for a specific message type
  const on = useCallback((type: string, handler: MessageHandler) => {
    return wsConnectionRef.current.on(type, handler);
  }, []);
  
  // Send a message through WebSocket.
  // Supports two forms:
  //  - send(type: string, data: object) -> sends { type, ...data, timestamp }
  //  - send(payload: object | string) -> sends the raw payload as JSON (useful when backend expects custom shape)
  const send = useCallback((typeOrPayload: string | object, data?: any) => {
    try {
      // If caller provided two args, treat as (type, data)
      if (typeof typeOrPayload === 'string' && data !== undefined) {
        const success = wsConnectionRef.current.send(typeOrPayload, data);
        if (!success && isConnected) setError(new Error('Failed to send message'));
        return success;
      }

      // Otherwise send raw payload (object or JSON string)
      const payload = typeof typeOrPayload === 'string' ? JSON.parse(typeOrPayload) : typeOrPayload;
      const socket = wsConnectionRef.current.socket;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
        return true;
      }
      if (isConnected) setError(new Error('Failed to send raw payload: socket not open'));
      return false;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  }, [isConnected]);
  
  // Request current positions
  const requestPositions = useCallback(() => {
    return wsConnectionRef.current.requestPositions();
  }, []);
  
  // Send a simulation event
  const sendEvent = useCallback((eventType: string, rakeId: string, details: any = {}) => {
    return wsConnectionRef.current.sendEvent(eventType, rakeId, details);
  }, []);
  
  // Control the simulation (pause/resume/stop)
  const controlSimulation = useCallback((action: 'pause' | 'resume' | 'stop') => {
    return wsConnectionRef.current.controlSimulation(action);
  }, []);
  
  // Reset messages array
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
  }, []);
  
  // Auto-connect on mount and disconnect on unmount
  useEffect(() => {
    const cleanup = connect();
    
    return () => {
      if (cleanup) cleanup();
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    isConnected,
    connectionStatus,
    sendMessage: send,
    lastMessage,
    messages,
    clearMessages,
    error,
    // Enhanced API
    on,
    send,
    requestPositions,
    sendEvent,
    controlSimulation,
    connect,
    disconnect,
  };
}

export default useWebSocket;