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

# ScannedItemType: frontend/types/types.ts
class ScannedItem(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    classification = db.Column(db.String(100))
    image = db.Column(db.String(200))  # URL
    type = db.Column(db.Enum('General Waste', 'Recycling' ,'Organic Waste', name='item_type'))
    tips = db.Column(db.String(1000))  # Store tips as a JSON string
    date = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    colour = db.Column(db.String(30), nullable=False)

    def __repr__(self):
        return f'<ScannedItem {self.name}>'