from fastapi import APIRouter, Depends, HTTPException, WebSocket, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import asyncio
import random
import logging
from datetime import datetime

from app.core.database import get_db
from app.services.simulation_service import get_live_positions, get_simulation_config, get_active_rakes, active_connections, broadcast_update, start_simulation_loop

router = APIRouter()

@router.get("/simulation/live")
async def get_live_simulation_data(db: Session = Depends(get_db)):
    """
    Get real-time rake positions for the simulation map
    """
    try:
        positions = get_live_positions(db)
        return positions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get live simulation data: {str(e)}")

@router.get("/simulation/config")
async def get_simulation_configuration(db: Session = Depends(get_db)):
    """
    Get configuration data for the simulation (routes, stations, etc.)
    """
    try:
        config = get_simulation_config(db)
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get simulation configuration: {str(e)}")

@router.get("/simulation/active-rakes")
async def get_active_rakes(db: Session = Depends(get_db)):
    """
    Get all currently active rakes for the simulation
    """
    try:
        # Convert from service data format to expected frontend format
        positions = get_live_positions(db)
        rakes = []
        
        for rake in positions["rakes"]:
            # Format to match frontend expectations
            rakes.append({
                "id": rake["rake_id"],
                "from": "Bokaro",  # Hardcoded for now
                "to": rake["destination"],
                "progress": random.randint(10, 95) if rake["status"] == "moving" else 
                            (0 if rake["status"] == "idle" else 50),
                "status": "In Transit" if rake["status"] == "moving" else
                          "Loading" if rake["status"] == "loading" else "Idle",
                "departureTime": datetime.now().strftime("%H:%M %p"),
                "eta": datetime.fromisoformat(rake["eta"]).strftime("%H:%M %p") if rake["eta"] else "N/A"
            })
        
        return rakes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get active rakes: {str(e)}")
        
@router.post("/simulation/start")
async def start_simulation(request: Request, db: Session = Depends(get_db)):
    """
    Start or restart the simulation
    """
    try:
        data = await request.json()
        speed_factor = data.get("speed_factor", 1.0)
        include_random_events = data.get("include_random_events", False)
        
        # Log simulation start
        logging.info(f"Starting simulation with speed_factor={speed_factor}, include_random_events={include_random_events}")
        
        # Start the simulation loop in a background task
        asyncio.create_task(start_simulation_loop(db, speed_factor, include_random_events))
        
        # Broadcast to all connected clients that simulation is starting
        asyncio.create_task(broadcast_update("simulation_started", {
            "speed_factor": speed_factor,
            "include_random_events": include_random_events,
            "message": "Simulation started"
        }))
        
        return {
            "status": "success",
            "message": "Simulation started",
            "settings": {
                "speed_factor": speed_factor,
                "include_random_events": include_random_events
            }
        }
    except Exception as e:
        logging.error(f"Failed to start simulation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start simulation: {str(e)}")

@router.post("/simulation/event")
async def handle_simulation_event(request: Request, db: Session = Depends(get_db)):
    """
    Handle custom simulation events like delays, breakdowns, etc.
    """
    try:
        data = await request.json()
        event_type = data.get("event_type")
        rake_id = data.get("rake_id")
        details = data.get("details", {})
        
        # Log the event
        logging.info(f"Simulation event received: {event_type} for rake {rake_id} with details {details}")
        
        # Process different types of events
        if event_type == "breakdown":
            # Simulate a rake breakdown
            # In a real implementation, you would update the rake status in the database
            return {
                "status": "success",
                "message": f"Breakdown event processed for rake {rake_id}",
                "impact": "Rake stopped, ETA updated"
            }
        elif event_type == "delay":
            # Simulate a delay
            delay_minutes = details.get("minutes", 30)
            return {
                "status": "success",
                "message": f"Delay event processed for rake {rake_id}",
                "impact": f"ETA extended by {delay_minutes} minutes"
            }
        elif event_type == "weather":
            # Simulate weather impact
            severity = details.get("severity", "medium")
            return {
                "status": "success",
                "message": f"Weather event ({severity}) processed",
                "impact": "Multiple rakes affected, speeds reduced"
            }
        else:
            return {
                "status": "warning",
                "message": f"Unknown event type: {event_type}"
            }
    except Exception as e:
        logging.error(f"Failed to process simulation event: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process simulation event: {str(e)}")
        
@router.post("/simulation/control")
async def control_simulation(request: Request):
    """
    Control the simulation (pause, resume, stop)
    """
    try:
        data = await request.json()
        action = data.get("action")
        
        if action not in ["pause", "resume", "stop"]:
            return {
                "status": "error",
                "message": f"Invalid action: {action}. Must be one of: pause, resume, stop"
            }
        
        # Log the control action
        logging.info(f"Simulation control: {action}")
        
        # Process the control action
        if action == "pause":
            # In a real implementation, you would pause the simulation loop
            return {
                "status": "success",
                "message": "Simulation paused",
                "state": "paused"
            }
        elif action == "resume":
            # In a real implementation, you would resume the simulation loop
            return {
                "status": "success",
                "message": "Simulation resumed",
                "state": "running"
            }
        else:  # stop
            # In a real implementation, you would stop the simulation and reset
            return {
                "status": "success",
                "message": "Simulation stopped",
                "state": "stopped"
            }
    except Exception as e:
        logging.error(f"Failed to control simulation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to control simulation: {str(e)}")

@router.websocket("/ws/simulation")
async def websocket_simulation(websocket: WebSocket, client_id: str = None):
    """
    WebSocket endpoint for real-time simulation updates
    """
    # Accept the connection
    await websocket.accept()
    
    if not client_id:
        client_id = f"client-{random.randint(1000, 9999)}"
    
    # Store the connection
    active_connections[client_id] = websocket
    
    try:
        # Send initial welcome message
        await websocket.send_json({
            "type": "connection_established",
            "client_id": client_id,
            "message": "Connected to simulation WebSocket",
            "timestamp": datetime.now().isoformat()
        })
        
        # Create a database session for this connection
        db = next(get_db())
        
        # Send initial data immediately
        positions = get_live_positions(db)
        await websocket.send_json({
            "type": "position_update",
            "data": positions,
            "timestamp": datetime.now().isoformat()
        })
        
        # Also send configuration data
        config = get_simulation_config(db)
        await websocket.send_json({
            "type": "config_update",
            "data": config,
            "timestamp": datetime.now().isoformat()
        })
        
        # Main WebSocket loop
        while True:
            # Wait for messages from the client
            data = await websocket.receive_json()
            
            # Process client messages
            message_type = data.get("type", "")
            
            if message_type == "get_positions":
                # Get current rake positions
                positions = get_live_positions(db)
                await websocket.send_json({
                    "type": "position_update",
                    "data": positions,
                    "timestamp": datetime.now().isoformat()
                })
            
            elif message_type == "ping":
                # Simple ping-pong to keep connection alive
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                })
            
            elif message_type == "simulate_event":
                # Handle a simulation event
                event_type = data.get("event_type", "")
                rake_id = data.get("rake_id", "")
                details = data.get("details", {})
                
                # Use the broadcast helper
                await broadcast_update("event_notification", {
                    "event_type": event_type,
                    "rake_id": rake_id,
                    "details": details,
                    "message": f"Event {event_type} occurred for rake {rake_id}"
                }, exclude_client_id=client_id)
                
                # Acknowledge receipt to the originator
                await websocket.send_json({
                    "type": "event_acknowledged",
                    "event_type": event_type,
                    "timestamp": datetime.now().isoformat()
                })
            
            elif message_type == "control_simulation":
                # Handle simulation control commands
                action = data.get("action", "")
                
                if action in ["pause", "resume", "stop"]:
                    # Broadcast to all clients
                    await broadcast_update("simulation_control", {
                        "action": action,
                        "initiated_by": client_id
                    })
                    
                    # Send acknowledgment
                    await websocket.send_json({
                        "type": "control_acknowledged",
                        "action": action,
                        "timestamp": datetime.now().isoformat()
                    })
                else:
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Invalid control action: {action}",
                        "timestamp": datetime.now().isoformat()
                    })
            
            else:
                # Unknown message type
                await websocket.send_json({
                    "type": "error",
                    "message": f"Unknown message type: {message_type}",
                    "timestamp": datetime.now().isoformat()
                })
    
    except Exception as e:
        logging.error(f"WebSocket error: {str(e)}")
    finally:
        # Remove the connection when closed
        if client_id in active_connections:
            del active_connections[client_id]
            # Notify other clients that this client disconnected
            asyncio.create_task(broadcast_update("client_disconnected", {
                "client_id": client_id,
                "message": f"Client {client_id} disconnected"
            }))