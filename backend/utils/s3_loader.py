import boto3
import json
import os
from dotenv import load_dotenv

load_dotenv() 

S3_BUCKET = os.getenv("S3_BUCKET_NAME")

def load_latest_events():
    """Load the latest events list from S3 (events/latest.json)."""
    s3 = boto3.client("s3")
    key = "events/latest.json"
    obj = s3.get_object(Bucket=S3_BUCKET, Key=key)
    data = json.loads(obj["Body"].read().decode("utf-8"))
    # data is expected to be a list of event dicts
    # If it's a list of strings, parse each string
    if isinstance(data, dict):
        if "events" in data:
            data = data["events"]
            print(data)
        else:
            raise ValueError(f"Unexpected dict format: keys={list(data.keys())}")
    return data
    
    