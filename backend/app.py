# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, User

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

if __name__ == '__main__':
    app.run(debug=True)