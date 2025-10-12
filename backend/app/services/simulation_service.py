from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional, Callable
import random
import logging
import asyncio
from datetime import datetime, timedelta
from fastapi import WebSocket

from app.models.rake import Rake
from app.models.order import Order

# Dictionary to store active WebSocket connections
# This is shared with the WebSocket handler in live_simulation.py
active_connections: Dict[str, WebSocket] = {}

def get_live_positions(db: Session) -> Dict[str, Any]:
    """
    Get real-time rake positions for the simulation map based on real database data
    """
    try:
        # Query active rakes from database
        active_rakes = db.query(Rake).filter(Rake.status != "Idle").all()
        
        rakes_data = []
        
        if active_rakes:
            for rake in active_rakes:
                # Get associated order for destination info
                order = db.query(Order).filter(Order.rake_id == rake.id).first()
                destination = order.destination if order else "Unknown"
                
                # Calculate position based on progress
                origin_pos = {"lat": 23.6345, "lng": 86.1432}  # Bokaro
                
                # Determine destination coordinates based on destination name
                if "Kolkata" in destination:
                    dest_pos = {"lat": 22.5672, "lng": 88.3694}  # Kolkata
                elif "Mumbai" in destination:
                    dest_pos = {"lat": 19.0760, "lng": 72.8777}  # Mumbai
                elif "Durgapur" in destination:
                    dest_pos = {"lat": 23.5489, "lng": 87.3198}  # Durgapur
                else:
                    # Random destination within reasonable range
                    dest_pos = {"lat": 23.0 + random.uniform(-1, 1), "lng": 87.0 + random.uniform(-1, 1)}
                
                # Interpolate position based on progress
                progress = rake.transit_progress / 100.0
                current_pos = {
                    "lat": origin_pos["lat"] + (dest_pos["lat"] - origin_pos["lat"]) * progress,
                    "lng": origin_pos["lng"] + (dest_pos["lng"] - origin_pos["lng"]) * progress
                }
                
                # Calculate speed based on status
                speed = 0
                if rake.status == "In Transit":
                    speed = random.randint(35, 50)
                elif rake.status == "Departed":
                    speed = random.randint(20, 35)
                elif rake.status == "Arriving":
                    speed = random.randint(10, 20)
                
                # Add to result
                rakes_data.append({
                    "rake_id": rake.id,
                    "position": current_pos,
                    "status": rake.status.lower(),
                    "speed": speed,
                    "destination": destination,
                    "eta": rake.eta.isoformat() if rake.eta else (datetime.now() + timedelta(hours=5)).isoformat(),
                    "utilization": rake.utilization,
                    "load_details": f"{rake.freight_type} - {rake.weight} tons" if rake.freight_type else "Unknown"
                })
        
        # If no rakes in database, provide sample data
        if not rakes_data:
            rakes_data = [
                {
                    "rake_id": "R-1001",
                    "position": {"lat": 23.6345, "lng": 86.1432},
                    "status": "moving",
                    "speed": 45,  # km/h
                    "destination": "Kolkata",
                    "eta": (datetime.now() + timedelta(hours=5)).isoformat(),
                    "utilization": 92,
                    "load_details": "HR Coil - 1200 tons"
                },
                {
                    "rake_id": "R-1002",
                    "position": {"lat": 23.7890, "lng": 86.4231},
                    "status": "loading",
                    "speed": 0,  # km/h
                    "destination": "Durgapur",
                    "eta": (datetime.now() + timedelta(hours=8)).isoformat(),
                    "utilization": 65,
                    "load_details": "CR Coil - 800 tons"
                }
            ]
        
        return {
            "rakes": rakes_data,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        logging.error(f"Error getting live positions: {e}")
        # Return fallback data in case of error
        return {
            "rakes": [
                {
                    "rake_id": "R-1001",
                    "position": {"lat": 23.6345, "lng": 86.1432},
                    "status": "moving",
                    "speed": 45,
                    "destination": "Kolkata",
                    "eta": (datetime.now() + timedelta(hours=5)).isoformat(),
                    "utilization": 92,
                    "load_details": "HR Coil - 1200 tons"
                }
            ],
            "timestamp": datetime.now().isoformat()
        }

def get_active_rakes(db: Session) -> List[Dict[str, Any]]:
    """
    Get all currently active rakes for simulation display
    """
    try:
        # Query active rakes from database
        active_rakes = db.query(Rake).filter(Rake.status != "Idle").all()
        
        rakes_data = []
        
        if active_rakes:
            for rake in active_rakes:
                # Get associated order for destination info
                order = db.query(Order).filter(Order.rake_id == rake.id).first()
                destination = order.destination if order else "Unknown"
                
                rakes_data.append({
                    "id": rake.id,
                    "from": rake.origin or "Bokaro",
                    "to": destination,
                    "progress": rake.transit_progress or 0,
                    "status": rake.status,
                    "departureTime": rake.departure_time.strftime("%H:%M %p") if rake.departure_time else "N/A",
                    "eta": rake.eta.strftime("%H:%M %p") if rake.eta else "N/A",
                    "freight": rake.freight_type or "N/A",
                    "weight": f"{rake.weight or 0} Tons"
                })
        
        # If no rakes in database, provide sample data
        if not rakes_data:
            rakes_data = [
                {"id": "R1234", "from": "Bokaro", "to": "CMO Kolkata", "progress": 45, "status": "In Transit", "departureTime": "08:30 AM", "eta": "14:45 PM", "freight": "Steel Coils", "weight": "1250 Tons"},
                {"id": "R5678", "from": "Bokaro", "to": "Customer A123", "progress": 78, "status": "In Transit", "departureTime": "07:15 AM", "eta": "12:30 PM", "freight": "Steel Plates", "weight": "980 Tons"},
                {"id": "R9012", "from": "Bokaro", "to": "CMO Mumbai", "progress": 92, "status": "Arriving", "departureTime": "06:00 AM", "eta": "15:10 PM", "freight": "Steel Tubes", "weight": "1080 Tons"},
                {"id": "R3456", "from": "Bokaro", "to": "Customer B456", "progress": 15, "status": "Departed", "departureTime": "09:45 AM", "eta": "18:20 PM", "freight": "Steel Beams", "weight": "1320 Tons"}
            ]
        
        return rakes_data
    
    except Exception as e:
        logging.error(f"Error getting active rakes: {e}")
        # Return fallback data in case of error
        return [
            {"id": "R1234", "from": "Bokaro", "to": "CMO Kolkata", "progress": 45, "status": "In Transit", "departureTime": "08:30 AM", "eta": "14:45 PM", "freight": "Steel Coils", "weight": "1250 Tons"},
            {"id": "R5678", "from": "Bokaro", "to": "Customer A123", "progress": 78, "status": "In Transit", "departureTime": "07:15 AM", "eta": "12:30 PM", "freight": "Steel Plates", "weight": "980 Tons"}
        ]

def get_simulation_config(db: Session) -> Dict[str, Any]:
    """
    Get configuration data for the simulation (routes, stations, etc.)
    """
    # For now, we're returning a standard configuration
    # In a future version, this could be stored in the database
    
    config = {
        "routes": [
            {
                "id": "route-001",
                "name": "Bokaro-Kolkata",
                "path": [
                    {"lat": 23.6345, "lng": 86.1432},
                    {"lat": 23.5489, "lng": 86.3562},
                    {"lat": 23.4567, "lng": 86.7890},
                    {"lat": 22.9865, "lng": 87.3421},
                    {"lat": 22.5672, "lng": 88.3694}  # Kolkata
                ],
                "distance": 260,  # km
                "avg_transit_time": 8  # hours
            },
            {
                "id": "route-002",
                "name": "Bokaro-Durgapur",
                "path": [
                    {"lat": 23.6345, "lng": 86.1432},
                    {"lat": 23.5832, "lng": 86.7023},
                    {"lat": 23.5489, "lng": 87.3198}  # Durgapur
                ],
                "distance": 128,  # km
                "avg_transit_time": 4  # hours
            }
        ],
        "stations": [
            {
                "id": "station-001",
                "name": "Bokaro Steel City",
                "position": {"lat": 23.6345, "lng": 86.1432},
                "capacity": 12,  # rakes
                "facilities": ["loading", "unloading", "maintenance"]
            },
            {
                "id": "station-002",
                "name": "Kolkata Terminal",
                "position": {"lat": 22.5672, "lng": 88.3694},
                "capacity": 8,  # rakes
                "facilities": ["unloading"]
            },
            {
                "id": "station-003",
                "name": "Durgapur",
                "position": {"lat": 23.5489, "lng": 87.3198},
                "capacity": 6,  # rakes
                "facilities": ["unloading"]
            },
            {
                "id": "station-004",
                "name": "Mumbai Terminal",
                "position": {"lat": 19.0760, "lng": 72.8777},
                "capacity": 10,  # rakes
                "facilities": ["unloading", "maintenance"]
            }
        ],
        "stockyards": [
            {
                "id": "stockyard-001",
                "name": "Bokaro Main Yard",
                "position": {"lat": 23.6298, "lng": 86.1458},
                "materials": [
                    {"type": "HR Coil", "quantity": 2500},
                    {"type": "CR Coil", "quantity": 1800},
                    {"type": "Plate", "quantity": 950}
                ]
            }
        ]
    }
    
    return config
    
async def broadcast_update(update_type: str, data: Dict[str, Any], exclude_client_id: str = None):
    """
    Broadcast an update to all active WebSocket connections
    
    Args:
        update_type: Type of update (position_update, event, alert, etc.)
        data: Data to broadcast
        exclude_client_id: Optional client ID to exclude from broadcast
    """
    if not active_connections:
        return
        
    # Prepare the message
    message = {
        "type": update_type,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }
    
    # Track failed connections to clean up later
    failed_connections = []
    
    # Send to all connections
    for client_id, connection in active_connections.items():
        if exclude_client_id and client_id == exclude_client_id:
            continue
            
        try:
            await connection.send_json(message)
        except Exception as e:
            logging.error(f"Failed to send to client {client_id}: {str(e)}")
            failed_connections.append(client_id)
    
    # Clean up failed connections
    for client_id in failed_connections:
        if client_id in active_connections:
            del active_connections[client_id]

async def start_simulation_loop(db: Session, speed_factor: float = 1.0, include_random_events: bool = False):
    """
    Start a continuous simulation loop that updates rake positions and broadcasts updates
    
    Args:
        db: Database session
        speed_factor: Speed multiplier for the simulation (1.0 = real-time)
        include_random_events: Whether to generate random events
    """
    try:
        # Set initial state
        is_running = True
        
        # Main simulation loop
        while is_running:
            # Get current positions
            positions = get_live_positions(db)
            
            # Broadcast the positions to all clients
            await broadcast_update("position_update", positions)
            
            # Generate random events if enabled
            if include_random_events and random.random() < 0.1:  # 10% chance each iteration
                event_types = ["delay", "breakdown", "weather"]
                event_type = random.choice(event_types)
                
                # Select a random rake
                if positions["rakes"]:
                    rake = random.choice(positions["rakes"])
                    rake_id = rake["rake_id"]
                    
                    # Create event data
                    event_data = {
                        "event_type": event_type,
                        "rake_id": rake_id,
                        "details": {}
                    }
                    
                    # Add specific details based on event type
                    if event_type == "delay":
                        event_data["details"]["minutes"] = random.randint(15, 90)
                        event_data["details"]["reason"] = random.choice(["Traffic congestion", "Signal failure", "Track maintenance"])
                    elif event_type == "breakdown":
                        event_data["details"]["severity"] = random.choice(["minor", "major"])
                        event_data["details"]["estimated_fix_time"] = random.randint(30, 180)  # minutes
                    elif event_type == "weather":
                        event_data["details"]["severity"] = random.choice(["light", "medium", "severe"])
                        event_data["details"]["condition"] = random.choice(["rain", "fog", "heat"])
                    
                    # Broadcast the event
                    await broadcast_update("event", event_data)
            
            # Sleep based on speed factor (default update every 5 seconds)
            await asyncio.sleep(5.0 / speed_factor)
    
    except Exception as e:
        logging.error(f"Error in simulation loop: {str(e)}")
    finally:
        logging.info("Simulation loop stopped")