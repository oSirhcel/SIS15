from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.String, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    scanned_items = db.relationship('ScannedItem', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class ScannedItem(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    classification = db.Column(db.String(100))
    image = db.Column(db.String(200))  # URL
    type = db.Column(db.Enum('General Waste', 'Recycling' ,'Organic Waste', name='item_type'))
    tips = db.Column(db.ARRAY(db.String(200)))  # PostgreSQL-specific ARRAY type
    date = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<ScannedItem {self.name}>'
    

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
"""