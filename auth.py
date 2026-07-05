# routes/auth.py - Login and registration
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from models import db, User
from utils.security import hash_password, check_password

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required'}), 400

    user = User.query.filter_by(email=data['email'].lower()).first()
    if not user or not check_password(data['password'], user.password_hash):
        return jsonify({'message': 'Invalid credentials'}), 401

    user.last_login = datetime.utcnow()
    db.session.commit()

    token = create_access_token(
        identity=str(user.id),
        additional_claims={'role': user.role, 'name': user.name}
    )
    return jsonify({'token': token, 'role': user.role, 'user': user.to_dict()})


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    for field in ['name', 'email', 'password', 'role']:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'message': 'Email already exists'}), 409

    user = User(
        name=data['name'],
        email=data['email'].lower(),
        password_hash=hash_password(data['password']),
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registered', 'user': user.to_dict()}), 201


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    if not user:
        return jsonify({'message': 'Not found'}), 404
    return jsonify({'user': user.to_dict()})
