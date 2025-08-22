from django.core.management.base import BaseCommand
from energy_app.models import Appliance

class Command(BaseCommand):
    help = 'Populate the database with sample appliances'

    def handle(self, *args, **options):
        self.stdout.write('🚀 Starting appliance population...')
        
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
            
            # Laundry
            {'name': 'Washing Machine (Front Load)', 'category': 'laundry', 'typical_wattage': 500, 'usage_hours_per_day': 1.5, 'efficiency_rating': '5 Star', 'icon': '👕'},
            {'name': 'Electric Dryer', 'category': 'laundry', 'typical_wattage': 3000, 'usage_hours_per_day': 1.0, 'efficiency_rating': '', 'icon': '🌪️'},
            {'name': 'Iron', 'category': 'laundry', 'typical_wattage': 1200, 'usage_hours_per_day': 0.5, 'efficiency_rating': '', 'icon': '👕'},
            
            # Entertainment
            {'name': 'LED TV (32 inch)', 'category': 'entertainment', 'typical_wattage': 80, 'usage_hours_per_day': 6.0, 'efficiency_rating': '4 Star', 'icon': '📺'},
            {'name': 'LED TV (55 inch)', 'category': 'entertainment', 'typical_wattage': 150, 'usage_hours_per_day': 5.0, 'efficiency_rating': '4 Star', 'icon': '📺'},
            {'name': 'Desktop Computer', 'category': 'entertainment', 'typical_wattage': 300, 'usage_hours_per_day': 8.0, 'efficiency_rating': '', 'icon': '💻'},
            {'name': 'Laptop', 'category': 'entertainment', 'typical_wattage': 65, 'usage_hours_per_day': 6.0, 'efficiency_rating': '', 'icon': '💻'},
            
            # Lighting
            {'name': 'LED Bulb (9W)', 'category': 'lighting', 'typical_wattage': 9, 'usage_hours_per_day': 6.0, 'efficiency_rating': '5 Star', 'icon': '💡'},
            {'name': 'LED Bulb (12W)', 'category': 'lighting', 'typical_wattage': 12, 'usage_hours_per_day': 6.0, 'efficiency_rating': '5 Star', 'icon': '💡'},
            {'name': 'CFL Bulb (20W)', 'category': 'lighting', 'typical_wattage': 20, 'usage_hours_per_day': 6.0, 'efficiency_rating': '3 Star', 'icon': '💡'},
            
            # Heating
            {'name': 'Room Heater', 'category': 'heating', 'typical_wattage': 2000, 'usage_hours_per_day': 4.0, 'efficiency_rating': '', 'icon': '🔥'},
            {'name': 'Water Heater (Geyser)', 'category': 'heating', 'typical_wattage': 3000, 'usage_hours_per_day': 2.0, 'efficiency_rating': '4 Star', 'icon': '🚿'},
            
            # Other
            {'name': 'Water Pump', 'category': 'other', 'typical_wattage': 750, 'usage_hours_per_day': 2.0, 'efficiency_rating': '', 'icon': '🚰'},
            {'name': 'WiFi Router', 'category': 'other', 'typical_wattage': 12, 'usage_hours_per_day': 24.0, 'efficiency_rating': '', 'icon': '📶'},
        ]
        
        created_count = 0
        updated_count = 0
        
        for appliance_data in appliances_data:
            appliance, created = Appliance.objects.get_or_create(
                name=appliance_data['name'],
                defaults=appliance_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Created: {appliance.name} ({appliance.typical_wattage}W)')
                )
            else:
                updated_count += 1
                self.stdout.write(f'🔄 Updated: {appliance.name}')
        
        self.stdout.write(
            self.style.SUCCESS(f'\n📊 Summary:')
        )
        self.stdout.write(f'   ✅ Created: {created_count} appliances')
        self.stdout.write(f'   🔄 Updated: {updated_count} appliances')
        self.stdout.write(f'   📱 Total: {Appliance.objects.count()} appliances in database')
