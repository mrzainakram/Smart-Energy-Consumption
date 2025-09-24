#!/usr/bin/env python
"""
Script to populate the database with sample appliances
"""

import os
import sys
import django

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_energy.settings')
django.setup()

from energy_app.models import Appliance

def populate_appliances():
    """Add sample appliances to the database"""
    
    appliances_data = [
        # Cooling
        {'name': 'Split Air Conditioner (1.5 Ton)', 'category': 'cooling', 'typical_wattage': 1800, 'usage_hours_per_day': 8.0, 'efficiency_rating': '3 Star', 'icon': '❄️'},
        {'name': 'Window AC (1 Ton)', 'category': 'cooling', 'typical_wattage': 1200, 'usage_hours_per_day': 6.0, 'efficiency_rating': '2 Star', 'icon': '🏠'},
        {'name': 'Ceiling Fan', 'category': 'cooling', 'typical_wattage': 75, 'usage_hours_per_day': 12.0, 'efficiency_rating': '5 Star', 'icon': '🌀'},
        {'name': 'Exhaust Fan', 'category': 'cooling', 'typical_wattage': 40, 'usage_hours_per_day': 4.0, 'efficiency_rating': '', 'icon': '💨'},
        
        # Kitchen
        {'name': 'Refrigerator (Double Door)', 'category': 'kitchen', 'typical_wattage': 250, 'usage_hours_per_day': 24.0, 'efficiency_rating': '4 Star', 'icon': '🧊'},
        {'name': 'Microwave Oven', 'category': 'kitchen', 'typical_wattage': 1200, 'usage_hours_per_day': 1.0, 'efficiency_rating': '', 'icon': '📡'},
        {'name': 'Electric Kettle', 'category': 'kitchen', 'typical_wattage': 1500, 'usage_hours_per_day': 0.5, 'efficiency_rating': '', 'icon': '☕'},
        {'name': 'Induction Cooktop', 'category': 'kitchen', 'typical_wattage': 2000, 'usage_hours_per_day': 2.0, 'efficiency_rating': '', 'icon': '🔥'},
        {'name': 'Electric Oven', 'category': 'kitchen', 'typical_wattage': 2500, 'usage_hours_per_day': 1.0, 'efficiency_rating': '', 'icon': '🍞'},
        
        # Laundry
        {'name': 'Washing Machine (Front Load)', 'category': 'laundry', 'typical_wattage': 500, 'usage_hours_per_day': 1.5, 'efficiency_rating': '5 Star', 'icon': '👕'},
        {'name': 'Washing Machine (Top Load)', 'category': 'laundry', 'typical_wattage': 400, 'usage_hours_per_day': 1.0, 'efficiency_rating': '3 Star', 'icon': '👔'},
        {'name': 'Electric Dryer', 'category': 'laundry', 'typical_wattage': 3000, 'usage_hours_per_day': 1.0, 'efficiency_rating': '', 'icon': '🌪️'},
        {'name': 'Iron', 'category': 'laundry', 'typical_wattage': 1200, 'usage_hours_per_day': 0.5, 'efficiency_rating': '', 'icon': '👕'},
        
        # Entertainment
        {'name': 'LED TV (32 inch)', 'category': 'entertainment', 'typical_wattage': 80, 'usage_hours_per_day': 6.0, 'efficiency_rating': '4 Star', 'icon': '📺'},
        {'name': 'LED TV (55 inch)', 'category': 'entertainment', 'typical_wattage': 150, 'usage_hours_per_day': 5.0, 'efficiency_rating': '4 Star', 'icon': '📺'},
        {'name': 'Desktop Computer', 'category': 'entertainment', 'typical_wattage': 300, 'usage_hours_per_day': 8.0, 'efficiency_rating': '', 'icon': '💻'},
        {'name': 'Laptop', 'category': 'entertainment', 'typical_wattage': 65, 'usage_hours_per_day': 6.0, 'efficiency_rating': '', 'icon': '💻'},
        {'name': 'Gaming Console', 'category': 'entertainment', 'typical_wattage': 150, 'usage_hours_per_day': 3.0, 'efficiency_rating': '', 'icon': '🎮'},
        {'name': 'Sound System', 'category': 'entertainment', 'typical_wattage': 100, 'usage_hours_per_day': 3.0, 'efficiency_rating': '', 'icon': '🔊'},
        
        # Lighting
        {'name': 'LED Bulb (9W)', 'category': 'lighting', 'typical_wattage': 9, 'usage_hours_per_day': 6.0, 'efficiency_rating': '5 Star', 'icon': '💡'},
        {'name': 'LED Bulb (12W)', 'category': 'lighting', 'typical_wattage': 12, 'usage_hours_per_day': 6.0, 'efficiency_rating': '5 Star', 'icon': '💡'},
        {'name': 'CFL Bulb (20W)', 'category': 'lighting', 'typical_wattage': 20, 'usage_hours_per_day': 6.0, 'efficiency_rating': '3 Star', 'icon': '💡'},
        {'name': 'Tube Light (40W)', 'category': 'lighting', 'typical_wattage': 40, 'usage_hours_per_day': 8.0, 'efficiency_rating': '', 'icon': '💡'},
        {'name': 'LED Strip Lights', 'category': 'lighting', 'typical_wattage': 24, 'usage_hours_per_day': 4.0, 'efficiency_rating': '5 Star', 'icon': '💡'},
        
        # Heating
        {'name': 'Room Heater', 'category': 'heating', 'typical_wattage': 2000, 'usage_hours_per_day': 4.0, 'efficiency_rating': '', 'icon': '🔥'},
        {'name': 'Water Heater (Geyser)', 'category': 'heating', 'typical_wattage': 3000, 'usage_hours_per_day': 2.0, 'efficiency_rating': '4 Star', 'icon': '🚿'},
        {'name': 'Hair Dryer', 'category': 'heating', 'typical_wattage': 1500, 'usage_hours_per_day': 0.2, 'efficiency_rating': '', 'icon': '💇'},
        
        # Other
        {'name': 'Water Pump', 'category': 'other', 'typical_wattage': 750, 'usage_hours_per_day': 2.0, 'efficiency_rating': '', 'icon': '🚰'},
        {'name': 'Vacuum Cleaner', 'category': 'other', 'typical_wattage': 1200, 'usage_hours_per_day': 0.5, 'efficiency_rating': '', 'icon': '🧹'},
        {'name': 'Sewing Machine', 'category': 'other', 'typical_wattage': 100, 'usage_hours_per_day': 1.0, 'efficiency_rating': '', 'icon': '🧵'},
        {'name': 'WiFi Router', 'category': 'other', 'typical_wattage': 12, 'usage_hours_per_day': 24.0, 'efficiency_rating': '', 'icon': '📶'},
        {'name': 'Phone Charger', 'category': 'other', 'typical_wattage': 5, 'usage_hours_per_day': 3.0, 'efficiency_rating': '', 'icon': '🔌'},
    ]
    
    print("🚀 Starting appliance population...")
    
    created_count = 0
    updated_count = 0
    
    for appliance_data in appliances_data:
        appliance, created = Appliance.objects.get_or_create(
            name=appliance_data['name'],
            defaults=appliance_data
        )
        
        if created:
            created_count += 1
            print(f"✅ Created: {appliance.name} ({appliance.typical_wattage}W)")
        else:
            # Update existing appliance
            for field, value in appliance_data.items():
                if field != 'name':  # Don't update the name
                    setattr(appliance, field, value)
            appliance.save()
            updated_count += 1
            print(f"🔄 Updated: {appliance.name} ({appliance.typical_wattage}W)")
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Created: {created_count} appliances")
    print(f"   🔄 Updated: {updated_count} appliances")
    print(f"   📱 Total: {Appliance.objects.count()} appliances in database")
    
    print("\n🏠 Appliances by category:")
    categories = Appliance.objects.values_list('category', flat=True).distinct()
    for category in categories:
        count = Appliance.objects.filter(category=category).count()
        print(f"   {category.title()}: {count} appliances")
    
    print("\n🎯 Database population completed successfully!")

if __name__ == '__main__':
    populate_appliances()
