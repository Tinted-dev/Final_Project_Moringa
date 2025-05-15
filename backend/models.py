from extensions import db
from flask_login import UserMixin

# Association table for many-to-many between Company and Region
company_region = db.Table('company_region',
    db.Column('company_id', db.Integer, db.ForeignKey('company.id'), primary_key=True),
    db.Column('region_id', db.Integer, db.ForeignKey('region.id'), primary_key=True)
)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='company')  # 'admin' or 'company'

    # One-to-one relationship with Company
    company = db.relationship('Company', back_populates='user', uselist=False)

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)

    user = db.relationship('User', back_populates='company')

    # Many-to-many with Region
    regions = db.relationship('Region', secondary=company_region, lazy='subquery',
                              backref=db.backref('companies', lazy=True))

    # One-to-many with ServiceRequest
    service_requests = db.relationship('ServiceRequest', back_populates='company', cascade='all, delete-orphan')

class Region(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)

    # Link back to company
    company = db.relationship('Company', back_populates='service_requests')
