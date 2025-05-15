from flask import Blueprint, request, jsonify
from models import Company, Region, User
from helpers import token_required, admin_required, format_company, format_region
from extensions import db
from flask_login import login_user

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# ---------------------------
# 🔄 REGIONS CRUD
# ---------------------------

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

# ---------------------------
# 🏢 COMPANIES CRUD
# ---------------------------

@admin_bp.route('/companies', methods=['GET'])
@token_required
@admin_required
def get_all_companies(current_user):
    companies = Company.query.all()
    return jsonify([format_company(company) for company in companies])

@admin_bp.route('/companies/<int:company_id>', methods=['PUT'])
@token_required
@admin_required
def update_company(current_user, company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({'message': 'Company not found'}), 404
    data = request.get_json()
    company.name = data.get('name', company.name)
    company.email = data.get('email', company.email)
    company.phone = data.get('phone', company.phone)
    company.region_id = data.get('region_id', company.region_id)
    company.approved = data.get('approved', company.approved)
    db.session.commit()
    return jsonify(format_company(company))

@admin_bp.route('/companies/<int:company_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_company(current_user, company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({'message': 'Company not found'}), 404
    db.session.delete(company)
    db.session.commit()
    return jsonify({'message': 'Company deleted'})

@admin_bp.route('/stats', methods=['GET'])
@token_required
@admin_required
def admin_stats(current_user):
    total_companies = Company.query.count()
    total_regions = Region.query.count()
    
    # Group companies by region
    companies_by_region = db.session.query(
        Region.name, db.func.count(Company.id)
    ).join(Company, Company.region_id == Region.id).group_by(Region.name).all()

    companies_per_region = [
        {"regionName": name, "count": count} for name, count in companies_by_region
    ]

    return jsonify({
        "totalCompanies": total_companies,
        "totalRegions": total_regions,
        "companiesPerRegion": companies_per_region
    })


@admin_bp.route('/companies/<int:company_id>/approve', methods=['POST'])
@token_required
@admin_required
def approve_company(current_user, company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({'message': 'Company not found'}), 404
    company.approved = True
    db.session.commit()
    return jsonify({'message': f'Company {company.name} approved'}), 200
