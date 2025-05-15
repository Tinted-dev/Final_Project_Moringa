from app import create_app
from extensions import db
from models import User, Region, Company
from werkzeug.security import generate_password_hash
import random

app = create_app()
app.app_context().push()

def seed():
    # Create admin user
    if not User.query.filter_by(email='admin@ecowaste.com').first():
        admin_user = User(
            email='admin@ecowaste.com',
            password=generate_password_hash('adminpass', method='pbkdf2:sha256'),
            role='admin'
        )
        db.session.add(admin_user)

    # Seed regions
    region_names = [
        'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
        'Thika', 'Nyeri', 'Machakos', 'Meru', 'Garissa'
    ]
    existing_regions = {region.name for region in Region.query.all()}
    for name in region_names:
        if name not in existing_regions:
            db.session.add(Region(name=name))
    db.session.commit()

    # Reload regions after commit
    regions = Region.query.all()

    # Sample companies with users
    sample_companies = [
        {
            'name': 'GreenCycle Ltd',
            'email': 'greencycle@example.com',
            'phone': '0712345678',
            'description': 'Recycling and composting services'
        },
        # ... (other companies unchanged)
        {
            'name': 'KleanEarth Ltd',
            'email': 'kleanearth@example.com',
            'phone': '0788987654',
            'description': 'Zero-waste initiative services'
        }
    ]

    for company_data in sample_companies:
        if not User.query.filter_by(email=company_data['email']).first():
            hashed_pw = generate_password_hash('companypass', method='pbkdf2:sha256')
            user = User(
                email=company_data['email'],
                password=hashed_pw,
                role='company'
            )
            db.session.add(user)
            db.session.flush()

            assigned_regions = random.sample(regions, k=random.choice([1, 2]))
            company = Company(
                name=company_data['name'],
                email=company_data['email'],
                phone=company_data['phone'],
                description=company_data['description'],
                user_id=user.id,
                regions=assigned_regions
            )
            db.session.add(company)

    db.session.commit()
    print("✅ Database seeded with admin, regions, and sample companies.")

if __name__ == '__main__':
    seed()
