from functools import wraps
from flask import request, jsonify, current_app
import jwt

from models import User
from extensions import login_manager

# -----------------------------------
# Token Authentication Decorator
# -----------------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Invalid token!'}), 401
        except Exception:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# -----------------------------------
# Admin Role Decorator
# -----------------------------------
def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'message': 'Admin privileges required!'}), 403
        return f(current_user, *args, **kwargs)

    return decorated

# -----------------------------------
# Flask-Login User Loader
# -----------------------------------
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# -----------------------------------
# Helper: Format Company
# -----------------------------------
def format_company(company):
    return {
        'id': company.id,
        'name': company.name,
        'phone': company.phone,
        'email': company.email,
        'description': company.description,
        'regions': [
            {'id': region.id, 'name': region.name}
            for region in company.regions
        ]
    }

# -----------------------------------
# Helper: Format Region
# -----------------------------------
def format_region(region):
    return {
        'id': region.id,
        'name': region.name
    }
