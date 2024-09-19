from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, User, ScannedItem
import base64
from PIL import Image
import io

app = Flask(__name__)
CORS(app)
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
        image = Image.open(io.BytesIO(image_bytes))

        # This is where you would process the image with your model

        # Placeholder response
        # ScannedItemType: frontend/types/types.ts
        # For now no image is sent, and taken image is reused in front end
        return jsonify({
            "id": '1',
            "userId": '1',
            "name": 'Plastic Water Bottle',
            "type": 'Organic Waste',
            "description":
              'Plastic water bottles are recyclable and should be placed in the recycling bin. Please make sure to empty and rinse the bottle before recycling.',
            "tips": [
              'Remove the cap and recycle separately',
              'Crush the bottle to save space',
              'Check for recycling symbol (#1 PET or #2 HDPE)',
            ],
            "date": '2021-05-01T12:00:00.000Z',
          }
        ), 200

    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)