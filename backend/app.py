from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///ecowaste.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Initialize LoginManager
login_manager = LoginManager()
login_manager.init_app(app)

# Define association table for Company-Region relationship
company_region = db.Table('company_region',
    db.Column('company_id', db.Integer, db.ForeignKey('company.id'), primary_key=True),
    db.Column('region_id', db.Integer, db.ForeignKey('region.id'), primary_key=True)
)

# Models
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='company')  # 'admin' or 'company'
    company = db.relationship('Company', backref='user', uselist=False)

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    regions = db.relationship('Region', secondary=company_region, lazy='subquery',
                              backref=db.backref('companies', lazy=True))

class Region(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

# Helper functions
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Invalid token!'}), 401
        except:
            return jsonify({'message': 'Invalid token!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'message': 'Admin privileges required!'}), 403
        return f(current_user, *args, **kwargs)
    
    return decorated

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Format company for JSON response
def format_company(company):
    return {
        'id': company.id,
        'name': company.name,
        'phone': company.phone,
        'email': company.email,
        'description': company.description,
        'regions': [{'id': region.id, 'name': region.name} for region in company.regions]
    }

# Format region for JSON response
def format_region(region):
    return {
        'id': region.id,
        'name': region.name
    }

# Routes
@app.route('/api/regions', methods=['GET'])
def get_regions():
    regions = Region.query.all()
    return jsonify([format_region(region) for region in regions])

@app.route('/api/companies', methods=['GET'])
def get_companies():
    region_id = request.args.get('region')
    
    if region_id:
        # Filter companies by region
        region = Region.query.get(region_id)
        if not region:
            return jsonify([])
        companies = region.companies
    else:
        # Get all companies
        companies = Company.query.all()
    
    return jsonify([format_company(company) for company in companies])

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(
        email=data['email'],
        password=hashed_password,
        role='company'  # Default role for registration
    )
    db.session.add(new_user)
    db.session.flush()  # Flush to get the user ID without committing
    
    # Create company profile
    regions = []
    if 'regions' in data:
        for region_id in data['regions']:
            region = Region.query.get(region_id)
            if region:
                regions.append(region)
    
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
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': {
            'id': new_user.id,
            'email': new_user.email,
            'role': new_user.role
        }
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_user_profile(current_user):
    return jsonify({
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'role': current_user.role
        }
    })

@app.route('/api/company/profile', methods=['GET'])
@token_required
def get_company_profile(current_user):
    if current_user.role != 'company' or not current_user.company:
        return jsonify({'message': 'Company profile not found'}), 404
    
    return jsonify(format_company(current_user.company))

@app.route('/api/company/profile', methods=['PUT'])
@token_required
def update_company_profile(current_user):
    if current_user.role != 'company' or not current_user.company:
        return jsonify({'message': 'Company profile not found'}), 404
    
    data = request.get_json()
    company = current_user.company
    
    # Update company details
    company.name = data.get('name', company.name)
    company.phone = data.get('phone', company.phone)
    company.email = data.get('email', company.email)
    company.description = data.get('description', company.description)
    
    # Update regions if provided
    if 'region_ids' in data:
        regions = []
        for region_id in data['region_ids']:
            region = Region.query.get(region_id)
            if region:
                regions.append(region)
        company.regions = regions
    
    db.session.commit()
    
    return jsonify(format_company(company))

# Admin routes
@app.route('/api/admin/stats', methods=['GET'])
@token_required
@admin_required
def get_admin_stats(current_user):
    total_companies = Company.query.count()
    total_regions = Region.query.count()
    
    # Get companies per region
    companies_per_region = []
    regions = Region.query.all()
    for region in regions:
        companies_per_region.append({
            'regionName': region.name,
            'count': len(region.companies)
        })
    
    return jsonify({
        'totalCompanies': total_companies,
        'totalRegions': total_regions,
        'companiesPerRegion': companies_per_region
    })

@app.route('/api/admin/companies', methods=['GET'])
@token_required
@admin_required
def get_admin_companies(current_user):
    companies = Company.query.all()
    return jsonify([format_company(company) for company in companies])

@app.route('/api/admin/companies/<int:company_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_company(current_user, company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({'message': 'Company not found'}), 404
    
    # Get the user associated with this company
    user = User.query.get(company.user_id)
    
    # Delete the company
    db.session.delete(company)
    
    # Delete the user if exists
    if user:
        db.session.delete(user)
    
    db.session.commit()
    
    return jsonify({'message': 'Company deleted successfully'})

@app.route('/api/admin/companies/<int:company_id>/reset-password', methods=['POST'])
@token_required
@admin_required
def reset_company_password(current_user, company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({'message': 'Company not found'}), 404
    
    # Get the user associated with this company
    user = User.query.get(company.user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Generate a temporary password
    temp_password = "ChangeMe123!"  # In production, use a secure random generator
    
    # Update user password
    user.password = generate_password_hash(temp_password, method='pbkdf2:sha256')
    db.session.commit()
    
    # In a real application, send an email with the temporary password
    
    return jsonify({'message': 'Password reset successfully'})

@app.route('/api/admin/regions', methods=['GET'])
@token_required
@admin_required
def get_admin_regions(current_user):
    regions = Region.query.all()
    return jsonify([format_region(region) for region in regions])

@app.route('/api/admin/regions', methods=['POST'])
@token_required
@admin_required
def create_region(current_user):
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'message': 'Region name is required'}), 400
    
    # Check if region already exists
    if Region.query.filter_by(name=data['name']).first():
        return jsonify({'message': 'Region already exists'}), 400
    
    # Create new region
    new_region = Region(name=data['name'])
    db.session.add(new_region)
    db.session.commit()
    
    return jsonify(format_region(new_region))

@app.route('/api/admin/regions/<int:region_id>', methods=['PUT'])
@token_required
@admin_required
def update_region(current_user, region_id):
    region = Region.query.get(region_id)
    if not region:
        return jsonify({'message': 'Region not found'}), 404
    
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'message': 'Region name is required'}), 400
    
    # Check if the new name already exists for another region
    existing_region = Region.query.filter_by(name=data['name']).first()
    if existing_region and existing_region.id != region_id:
        return jsonify({'message': 'Region name already exists'}), 400
    
    # Update region
    region.name = data['name']
    db.session.commit()
    
    return jsonify(format_region(region))

@app.route('/api/admin/regions/<int:region_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_region(current_user, region_id):
    region = Region.query.get(region_id)
    if not region:
        return jsonify({'message': 'Region not found'}), 404
    
    # Check if region is associated with any companies
    if region.companies:
        return jsonify({'message': 'Cannot delete region that is associated with companies'}), 400
    
    # Delete region
    db.session.delete(region)
    db.session.commit()
    
    return jsonify({'message': 'Region deleted successfully'})

# Create initial admin user and sample data
@app.before_first_request
def create_initial_data():
    # Check if database is already initialized
    if User.query.first() is not None:
        return
    
    # Create admin user
    admin_user = User(
        email='admin@ecowaste.example',
        password=generate_password_hash('admin123', method='pbkdf2:sha256'),
        role='admin'
    )
    db.session.add(admin_user)
    
    # Create sample regions
    regions = [
        Region(name='North'),
        Region(name='South'),
        Region(name='East'),
        Region(name='West'),
        Region(name='Central')
    ]
    for region in regions:
        db.session.add(region)
    
    db.session.commit()
    
    # Create sample companies
    sample_companies = [
        {
            'email': 'greenbin@example.com',
            'password': 'password123',
            'name': 'GreenBin Recycling',
            'phone': '555-123-4567',
            'description': 'Specializing in residential recycling services with a focus on sustainability.',
            'regions': [regions[0], regions[2]]  # North, East
        },
        {
            'email': 'cleancity@example.com',
            'password': 'password123',
            'name': 'Clean City Waste Management',
            'phone': '555-234-5678',
            'description': 'Comprehensive waste management for commercial and residential properties.',
            'regions': [regions[1], regions[4]]  # South, Central
        },
        {
            'email': 'ecowaste@example.com',
            'password': 'password123',
            'name': 'EcoWaste Solutions',
            'phone': '555-345-6789',
            'description': 'Eco-friendly waste collection with zero-emission vehicles.',
            'regions': [regions[3], regions[4]]  # West, Central
        }
    ]
    
    for company_data in sample_companies:
        user = User(
            email=company_data['email'],
            password=generate_password_hash(company_data['password'], method='pbkdf2:sha256'),
            role='company'
        )
        db.session.add(user)
        db.session.flush()
        
        company = Company(
            user_id=user.id,
            name=company_data['name'],
            phone=company_data['phone'],
            email=company_data['email'],
            description=company_data['description'],
            regions=company_data['regions']
        )
        db.session.add(company)
    
    db.session.commit()

# Run server
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)