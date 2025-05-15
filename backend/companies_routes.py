from flask import Blueprint, request, jsonify
from models import Company, Region
from extensions import db
from helpers import token_required, format_company

# Blueprint with plural naming
companies_bp = Blueprint('companies', __name__, url_prefix='/api/companies')

# GET all companies or filter by region
@companies_bp.route('', methods=['GET'])
def get_companies():
    region_id = request.args.get('region')
    
    if region_id:
        region = Region.query.get(region_id)
        if not region:
            return jsonify([]), 200
        companies = region.companies
    else:
        companies = Company.query.all()
    
    return jsonify([format_company(company) for company in companies]), 200

# GET current user's company profile
@companies_bp.route('/profile', methods=['GET'])
@token_required
def get_company_profile(current_user):
    if current_user.role != 'company' or not current_user.company:
        return jsonify({'message': 'Company profile not found'}), 404
    
    return jsonify(format_company(current_user.company)), 200

# PUT update current user's company profile
@companies_bp.route('/profile', methods=['PUT'])
@token_required
def update_company_profile(current_user):
    if current_user.role != 'company' or not current_user.company:
        return jsonify({'message': 'Company profile not found'}), 404
    
    data = request.get_json()
    company = current_user.company

    # Update basic fields
    company.name = data.get('name', company.name)
    company.phone = data.get('phone', company.phone)
    company.email = data.get('email', company.email)
    company.description = data.get('description', company.description)

    # Update region relationships if provided
    if 'region_ids' in data:
        regions = []
        for region_id in data['region_ids']:
            region = Region.query.get(region_id)
            if region:
                regions.append(region)
        company.regions = regions

    db.session.commit()

    return jsonify(format_company(company)), 200
