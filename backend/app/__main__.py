from flask import Flask, jsonify, request
from flask_cors import CORS
import base64
from PIL import Image
#from config import Config
#from models import db, User, ScannedItem
import time
import io
import sys
import os
from datetime import datetime
from openAIAPI import open_ai_response
import uuid
from classificationMapping import map_class
import pathlib
import warnings
from config import Config

app = Flask(__name__)
CORS(app)

# Get paths from config
IMAGES_PATH = Config.IMAGES_PATH
MODEL_PATH = Config.MODEL_PATH

# Add the parent directory of "model" to the system path
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from model.evaluate import get_prediction

# Adding a directory to store processed images
processed_images_path = os.path.join(pathlib.Path(__file__).parent.parent.resolve(), IMAGES_PATH) 
if not os.path.isdir(processed_images_path):
    os.mkdir(processed_images_path)

@app.route('/scan', methods=['POST'])
def process_image():
    data = request.json
    base64_string = data.get('img_base64')

    if not base64_string:
        return jsonify({'error': 'No image data provided'}), 400
    
    try:
        # Convert base64 string to an image file
        image_dir = convert_base64_jpg(base64_string)
        
        # Process the image and get classification
        # Needs to be changed in production
        classification = get_prediction(image_dir, os.path.join(pathlib.Path(__file__).parent.parent.resolve(), MODEL_PATH))
        print(f"Classification: {classification}")
        
        # Get suggestions from OpenAI based on classification
        suggestions = open_ai_response(classification)
        print(f"Suggestions: {suggestions}")
        recycle_suggestion = suggestions.get("recycle_suggestion", "No recycle suggestion available")
        reuse_suggestion = suggestions.get("reuse_suggestion", "No reuse suggestion available")
        
        # Build the response (remove userId and date)
        response_data = {
            "id": str(uuid.uuid1()), # Generate a unique ID for the item
            "type": map_class(classification),
            "suggestions": {
                "recycle": recycle_suggestion,
                "reuse": reuse_suggestion,
            },
            "companies": format_companies(suggestions),
        }
        
        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500


def format_companies(suggestions):
    # Assuming suggestions["companies"] is a list of dictionaries with "name" and "website"
    companies_list = []
    for company in suggestions["companies"]:
        companies_list.append({
            "name": company["name"],
            "website": company["website"]
        })
    return companies_list


def convert_base64_jpg(base64_string):
    # Ensure the base64 string doesn't include prefixes
    if "base64," in base64_string:
        base64_string = base64_string.split("base64,")[1]

    # Decode the base64 string
    try:
        image_data = base64.b64decode(base64_string)
    except Exception as e:
        raise ValueError(f"Invalid base64 data: {e}")

    # Generate a unique image ID
    image_id = uuid.uuid1()

    # Path where the image will be saved
    # Needs to be changed in production
    temp_img_dir = os.path.join(processed_images_path, f"{image_id}.jpg")
    print(f"Saving image to: {temp_img_dir}")

    # Save the decoded image to a file
    with open(temp_img_dir, 'wb') as file:
        file.write(image_data)

    return temp_img_dir  # Return the file path


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)