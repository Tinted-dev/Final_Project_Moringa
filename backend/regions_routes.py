# regions_routes.py

from flask import Blueprint, jsonify
from models import Region

regions_bp = Blueprint('regions', __name__, url_prefix='/api')

@regions_bp.route('/regions', methods=['GET'])
def get_regions():
    regions = Region.query.all()
    return jsonify([{'id': r.id, 'name': r.name} for r in regions])
