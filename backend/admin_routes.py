from flask import Blueprint, request, jsonify
from models import Company, Region, User
from helpers import token_required, admin_required, format_company, format_region
from extensions import db

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/regions', methods=['GET'])
@token_required
@admin_required
def get_regions(current_user):
    regions = Region.query.all()
    return jsonify([format_region(region) for region in regions])

@admin_bp.route('/regions', methods=['POST'])
@token_required
@admin_required
def add_region(current_user):
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'message': 'Region name is required'}), 400
    
    if Region.query.filter_by(name=data['name']).first():
        return jsonify({'message': 'Region already exists'}), 400
    
    region = Region(name=data['name'])
    db.session.add(region)
    db.session.commit()
    return jsonify(format_region(region)), 201

@admin_bp.route('/regions/<int:region_id>', methods=['PUT'])
@token_required
@admin_required
def update_region(current_user, region_id):
    region = Region.query.get(region_id)
    if not region:
        return jsonify({'message': 'Region not found'}), 404
    
    data = request.get_json()
    if 'name' in data:
        region.name = data['name']
    
    db.session.commit()
    return jsonify(format_region(region))

@admin_bp.route('/regions/<int:region_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_region(current_user, region_id):
    region = Region.query.get(region_id)
    if not region:
        return jsonify({'message': 'Region not found'}), 404
    
    db.session.delete(region)
    db.session.commit()
    return jsonify({'message': 'Region deleted'})

@admin_bp.route('/companies', methods=['GET'])
@token_required
@admin_required
def get_all_companies(current_user):
    companies = Company.query.all()
    return jsonify([format_company(company) for company in companies])

# routes/admin.py

# regions_bp = Blueprint('regions', __name__, url_prefix='/api')

# @regions_bp.route('/regions', methods=['GET'])
# @token_required  # You can remove this if public
# def get_regions(current_user=None):  # Pass current_user if token_required used
#     regions = Region.query.all()
#     return jsonify([{'id': r.id, 'name': r.name} for r in regions])

# @admin_bp.route('/companies/<int:company_id>/approve', methods=['POST'])
# @token_required
# @admin_required
# def approve_company(current_user, company_id):
#     company = Company.query.get(company_id)
#     if not company:
#         return jsonify({'message': 'Company not found'}), 404
    
    # Implement approval logic, e.g.:
    # company.approved = True
    # db.session.commit()
    # For now just a stub:
    
    return jsonify({'message': f'Company {company.name} approved'})
