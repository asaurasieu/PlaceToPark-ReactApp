import json 
import firebase_admin 
from firebase_admin import credentials, firestore 
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Initialize Firebase Admin SDK 
cred = credentials.Certificate("proyecto-parking-aa0e2-firebase-adminsdk-alxi3-16868e821f.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def geolocation(file_path): 
    try: 
        with open(file_path, "r") as f:
            data = json.load(f)
            
        collection_name = "parking_areas"
        for index, record in enumerate(data):
            latitude = record.get("latitude")
            longitude = record.get("longitude")
            
            location_data = {
                "geohash": f"{latitude},{longitude}", 
                "coordinates": {"latitude": latitude, "longitude": longitude}
            }
            
            # merge location data with record
            record["location"] = location_data
            
            print(f"Uploading record {index + 1}/{len(data)}...")

            doc_ref = db.collection(collection_name).document(str(index))
            doc_ref.set(record)
            
        print("Data uploaded succesfully")
    except Exception as e:
        print(f"An error occured: {e}")
        
geolocation("output.json")