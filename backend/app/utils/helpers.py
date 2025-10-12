import uuid
import random
import string
from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timedelta
import json
import os

def generate_id(prefix: str = "", length: int = 8) -> str:
    """
    Generate a random ID with optional prefix
    
    Args:
        prefix: Optional prefix for the ID
        length: Length of the random part
        
    Returns:
        Generated ID
    """
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"{prefix}{random_part}" if prefix else random_part

def format_timestamp(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format a datetime object as string
    
    Args:
        dt: Datetime object
        format_str: Format string
        
    Returns:
        Formatted datetime string
    """
    return dt.strftime(format_str)

def parse_timestamp(timestamp_str: str, format_str: str = "%Y-%m-%d %H:%M:%S") -> datetime:
    """
    Parse a timestamp string into a datetime object
    
    Args:
        timestamp_str: Timestamp string
        format_str: Format string
        
    Returns:
        Datetime object
    """
    try:
        return datetime.strptime(timestamp_str, format_str)
    except ValueError:
        # Try ISO format as fallback
        return datetime.fromisoformat(timestamp_str)

def load_json_file(file_path: str) -> Union[Dict[str, Any], List[Any]]:
    """
    Load JSON data from a file
    
    Args:
        file_path: Path to JSON file
        
    Returns:
        Parsed JSON data
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    with open(file_path, 'r') as f:
        return json.load(f)

def save_json_file(data: Union[Dict[str, Any], List[Any]], file_path: str) -> None:
    """
    Save data to a JSON file
    
    Args:
        data: Data to save
        file_path: Path to JSON file
    """
    # Ensure directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two coordinates using the Haversine formula
    
    Args:
        lat1: Latitude of first point
        lon1: Longitude of first point
        lat2: Latitude of second point
        lon2: Longitude of second point
        
    Returns:
        Distance in kilometers
    """
    import math
    
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of earth in kilometers
    
    return c * r