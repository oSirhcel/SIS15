from flask import Flask, jsonify, request
from flask_cors import CORS
#from config import Config
#from models import db, User, ScannedItem
import base64
from PIL import Image
import time
import io
import sys
import os
from datetime import datetime

# Add the parent directory of "model" to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from model.evaluate import get_prediction
import uuid

app = Flask(__name__)
CORS(app)
"""
app.config.from_object(Config)
db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()

@app.route('/', methods=['GET'])
def get_all_users():
    try:
        users = db.session.get(User)
        user_list = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
            user_list.append(user_data)
          
        return jsonify({'users': user_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/history', methods=['GET'])
def get_user_history():
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({'error': 'userId is required'}), 400
        
        # Check if the user exists
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Fetch all scanned items for the user
        scanned_items = db.session.query(ScannedItem).filter_by(user_id=user_id).all()
        

        # ScannedItemType: frontend/types/types.ts
        items_list = []
        for item in scanned_items:
            item_data = {
                'id': item.id,
                'name': item.name,
                'description': item.description,
                'classification': item.classification,
                'image': item.image,
                'type': item.type,
                'tips': item.tips,
                'date': item.date.isoformat() if item.date else None
            }
            items_list.append(item_data)
        return jsonify({
            'userId': user_id,
            'items': items_list
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
"""

@app.route('/scan', methods=['POST'])
def process_image():
    data = request.json
    base64_string = data.get('img_base64')

    if not base64_string:
        return jsonify({'error': 'No image data provided'}), 400
    try:
        # Decode the base64 string to bytes
        image_bytes = base64.b64decode(base64_string)

        # Convert bytes to PIL Image
        #image = Image.open(io.BytesIO(image_bytes))
        image_dir = convert_base64_jpg(base64_string)
        time.sleep(2)
        # This is where you would process the image with your model
        classification = get_prediction(image_dir, "/Users/ethanburgess/Downloads/best.pth")

        return jsonify({
            "id": '1',
            "userId": '1',
            "name": f'{classification}',
            "type": f'{classification}',
            "description":
              'Plastic water bottles are recyclable and should be placed in the recycling bin. Please make sure to empty and rinse the bottle before recycling.',
            "tips": [
              'Remove the cap and recycle separately',
              'Crush the bottle to save space',
              'Check for recycling symbol (#1 PET or #2 HDPE)',
            ],
            "date": f'{datetime.now()}',
          }
        ), 200

    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500


def convert_base64_jpg(base64_string):
    # Ensure the base64 string doesn't include prefixes
    if "base64," in base64_string:
        base64_string = base64_string.split("base64,")[1]

    # Decode the base64 string
    image_data = base64.b64decode(base64_string)
    # Generate a unique image ID
    image_id = uuid.uuid1()

    # Path where the image will be saved
    temp_img_dir = f"/Users/ethanburgess/Desktop/UTS/sem22024/sis/SIS15/tempFiles/{image_id}.jpg"

    print(f"Saving image to: {temp_img_dir}")

    # Save the decoded image to a file
    with open(temp_img_dir, 'wb') as file:
        file.write(image_data)

    return temp_img_dir  # Return the file path

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)