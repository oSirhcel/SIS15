# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db, User, ScannedItem

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db.init_app(app)

@app.route('/', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
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
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Fetch all scanned items for the user
        scanned_items = ScannedItem.query.filter_by(user_id=user_id).all()
        
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

if __name__ == '__main__':
    app.run(debug=True)