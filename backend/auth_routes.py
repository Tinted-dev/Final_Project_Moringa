from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt

from models import User, Company, Region
from extensions import db
from helpers import token_required, format_company  # Make sure these exist

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# ----------------------
# User Registration
# ----------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if email is already registered
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already registered'}), 400

    # Create new user
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(
        email=data['email'],
        password=hashed_password,
        role='company'
    )
    db.session.add(new_user)
    db.session.flush()  # to access new_user.id before commit

    # Fetch regions
    regions = []
    for region_id in data.get('regions', []):
        region = Region.query.get(region_id)
        if region:
            regions.append(region)

    # Create company profile
    new_company = Company(
        user_id=new_user.id,
        name=data['company_name'],
        phone=data['phone'],
        email=data['email'],
        description=data['description'],
        regions=regions
    )
    db.session.add(new_company)
    db.session.commit()

    # Generate token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'token': token,
        'user': {
            'id': new_user.id,
            'email': new_user.email,
            'role': new_user.role
        }
    })

# ----------------------
# User Login
# ----------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data.get('email')).first()
    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({'message': 'Invalid email or password'}), 401

    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role
        }
    })

# ----------------------
# Get Current User Profile
# ----------------------
@auth_bp.route('/me', methods=['GET'])
@token_required
def get_user_profile(current_user):
    response = {
        'id': current_user.id,
        'email': current_user.email,
        'role': current_user.role
    }

    if current_user.role == 'company' and current_user.company:
        response['company'] = format_company(current_user.company)

    return jsonify({'user': response})
