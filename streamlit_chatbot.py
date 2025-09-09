import streamlit as st
import json
import time
from datetime import datetime

def generate_ai_response(prompt):
    """Generate mock AI responses based on user input"""
    
    if any(word in prompt for word in ['bill', 'cost', 'payment', 'amount']):
        return """💰 **Bill Analysis & Cost Optimization:**

Based on your energy usage patterns, here are some insights:

📊 **Current Analysis:**
- Your average monthly consumption: 450 kWh
- Estimated monthly cost: $67.50
- Peak usage hours: 6 PM - 10 PM

💡 **Cost-Saving Tips:**
1. Shift heavy appliance usage to off-peak hours
2. Use programmable thermostats
3. Replace incandescent bulbs with LEDs
4. Unplug devices when not in use

**Potential Monthly Savings: $15-25**"""

    elif any(word in prompt for word in ['energy', 'consumption', 'usage', 'kwh']):
        return """⚡ **Energy Consumption Insights:**

🏠 **Your Home Energy Breakdown:**
- Air Conditioning: 35% (150 kWh)
- Water Heating: 20% (85 kWh)
- Lighting: 15% (65 kWh)
- Appliances: 20% (90 kWh)
- Electronics: 10% (45 kWh)

📈 **Optimization Recommendations:**
1. **AC Efficiency:** Set to 78°F, use ceiling fans
2. **Water Heating:** Lower temperature to 120°F
3. **Smart Lighting:** Install motion sensors
4. **Appliance Upgrades:** Look for ENERGY STAR certified models

**Expected Reduction: 15-20% monthly savings**"""

    elif any(word in prompt for word in ['tips', 'save', 'reduce', 'efficiency']):
        return """💡 **Smart Energy Saving Tips:**

🌟 **Quick Wins (Immediate Impact):**
1. Adjust thermostat by 2-3 degrees
2. Use cold water for washing clothes
3. Air dry clothes instead of using dryer
4. Unplug electronics when not in use

🏠 **Home Improvements (Long-term):**
1. Install programmable thermostats
2. Upgrade to LED lighting
3. Seal air leaks around windows/doors
4. Add insulation to attic and walls

📱 **Smart Technology:**
1. Smart power strips
2. Energy monitoring devices
3. Smart thermostats
4. Automated lighting systems

**Monthly Savings Potential: 20-30%**"""

    elif any(word in prompt for word in ['solar', 'renewable', 'panels']):
        return """☀️ **Solar & Renewable Energy Options:**

🔋 **Solar Panel Benefits:**
- Average 25-year savings: $20,000-$50,000
- Typical payback period: 6-10 years
- Reduce carbon footprint by 80%
- Increase home value by 4%

💰 **Financial Incentives:**
- Federal tax credit: 30% (through 2032)
- State rebates available
- Net metering programs
- Power purchase agreements (PPAs)

📊 **Your Solar Potential:**
Based on your location and roof size:
- Estimated system size: 6-8 kW
- Annual production: 8,000-12,000 kWh
- Monthly savings: $80-120

**Next Steps:** Get a free solar assessment!"""

    elif any(word in prompt for word in ['appliance', 'refrigerator', 'ac', 'washer', 'dryer']):
        return """🏠 **Smart Appliance Recommendations:**

❄️ **Refrigerator (20% of energy use):**
- ENERGY STAR models use 15% less energy
- Optimal temperature: 37-40°F (fridge), 5°F (freezer)
- Keep coils clean, check door seals

🌀 **Air Conditioning (35% of energy use):**
- Upgrade to high SEER rating (16+ recommended)
- Regular filter changes (monthly)
- Smart thermostats save 10-15%

👕 **Washer & Dryer (10% of energy use):**
- Use cold water (90% of energy goes to heating)
- Clean dryer lint after every load
- Consider heat pump dryers

🔥 **Water Heater (20% of energy use):**
- Tankless units are 30% more efficient
- Lower temperature to 120°F
- Insulate tank and pipes

**Upgrade Priority: AC → Water Heater → Refrigerator**"""

    elif any(word in prompt for word in ['hello', 'hi', 'help', 'start']):
        return """👋 **Welcome to Smart Energy AI!**

I'm here to help you optimize your energy usage and save money! Here's what I can assist you with:

🔍 **Energy Analysis:**
- Analyze your consumption patterns
- Identify energy waste areas
- Compare with similar homes

💰 **Cost Optimization:**
- Bill analysis and breakdown
- Money-saving strategies
- ROI calculations for upgrades

🏠 **Home Efficiency:**
- Appliance recommendations
- Insulation and weatherization tips
- Smart home technology advice

🌱 **Renewable Energy:**
- Solar panel feasibility
- Battery storage options
- Green energy programs

**Just ask me anything about energy efficiency, costs, or home improvements!**"""

    else:
        return f"""🤖 **AI Assistant Response:**

Thank you for your question about "{prompt}". I'm here to help with energy-related topics!

🔍 **Popular Topics I Can Help With:**
- Energy bill analysis and cost reduction
- Home appliance efficiency tips
- Solar panel and renewable energy options
- Smart home technology recommendations
- Seasonal energy optimization strategies

💡 **Quick Energy Tip:**
Did you know that adjusting your thermostat by just 2 degrees can save 10-15% on your energy bill?

**Feel free to ask me more specific questions about:**
- Your energy bills
- Appliance efficiency
- Home improvements
- Solar energy options
- Energy-saving tips

How can I help you save energy and money today?"""

# Page configuration
st.set_page_config(
    page_title="Smart Energy AI Chatbot",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for better mobile experience
st.markdown("""
<style>
    .stApp {
        max-width: 100%;
        padding: 1rem;
    }
    
    .chat-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        margin-bottom: 2rem;
        color: white;
    }
    
    .chat-message {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        backdrop-filter: blur(10px);
    }
    
    .user-message {
        background: rgba(102, 126, 234, 0.3);
        margin-left: 2rem;
    }
    
    .bot-message {
        background: rgba(118, 75, 162, 0.3);
        margin-right: 2rem;
    }
    
    @media (max-width: 768px) {
        .stApp {
            padding: 0.5rem;
        }
        .chat-container {
            padding: 1rem;
        }
        .user-message, .bot-message {
            margin-left: 0;
            margin-right: 0;
        }
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "Hello! I'm your Smart Energy AI Assistant. I can help you with:\n\n🔌 Energy consumption analysis\n💡 Energy-saving tips\n📊 Bill analysis\n🏠 Home efficiency recommendations\n\nHow can I help you today?"
        }
    ]

# Header
st.markdown("""
<div class="chat-container">
    <h1>🤖 Smart Energy AI Chatbot</h1>
    <p>Your intelligent assistant for energy management and optimization</p>
</div>
""", unsafe_allow_html=True)

# Chat interface
st.subheader("💬 Chat with AI Assistant")

# Display chat messages
for message in st.session_state.messages:
    css_class = "user-message" if message["role"] == "user" else "bot-message"
    role_icon = "👤" if message["role"] == "user" else "🤖"
    
    st.markdown(f"""
    <div class="chat-message {css_class}">
        <strong>{role_icon} {message["role"].title()}:</strong><br>
        {message["content"]}
    </div>
    """, unsafe_allow_html=True)

# Chat input
if prompt := st.chat_input("Ask me about energy consumption, savings tips, or bill analysis..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # Generate AI response (mock responses for demo)
    with st.spinner("AI is thinking..."):
        time.sleep(1)  # Simulate processing time
        
        # Mock AI responses based on keywords
        response = generate_ai_response(prompt.lower())
        
    # Add AI response
    st.session_state.messages.append({"role": "assistant", "content": response})
    
    # Rerun to show new messages
    st.rerun()

def generate_ai_response(prompt):
    """Generate mock AI responses based on user input"""
    
    if any(word in prompt for word in ['bill', 'cost', 'payment', 'amount']):
        return """💰 **Bill Analysis & Cost Optimization:**

Based on your energy usage patterns, here are some insights:

📊 **Current Analysis:**
- Your average monthly consumption: 450 kWh
- Estimated monthly cost: $67.50
- Peak usage hours: 6 PM - 10 PM

💡 **Cost-Saving Tips:**
1. Shift heavy appliance usage to off-peak hours
2. Use programmable thermostats
3. Replace incandescent bulbs with LEDs
4. Unplug devices when not in use

**Potential Monthly Savings: $15-25**"""

    elif any(word in prompt for word in ['energy', 'consumption', 'usage', 'kwh']):
        return """⚡ **Energy Consumption Insights:**

🏠 **Your Home Energy Breakdown:**
- Air Conditioning: 35% (150 kWh)
- Water Heating: 20% (85 kWh)
- Lighting: 15% (65 kWh)
- Appliances: 20% (90 kWh)
- Electronics: 10% (45 kWh)

📈 **Optimization Recommendations:**
1. **AC Efficiency:** Set to 78°F, use ceiling fans
2. **Water Heating:** Lower temperature to 120°F
3. **Smart Lighting:** Install motion sensors
4. **Appliance Upgrades:** Look for ENERGY STAR certified models

**Expected Reduction: 15-20% monthly savings**"""

    elif any(word in prompt for word in ['tips', 'save', 'reduce', 'efficiency']):
        return """💡 **Smart Energy Saving Tips:**

🌟 **Quick Wins (Immediate Impact):**
1. Adjust thermostat by 2-3 degrees
2. Use cold water for washing clothes
3. Air dry clothes instead of using dryer
4. Unplug electronics when not in use

🏠 **Home Improvements (Long-term):**
1. Install programmable thermostats
2. Upgrade to LED lighting
3. Seal air leaks around windows/doors
4. Add insulation to attic and walls

📱 **Smart Technology:**
1. Smart power strips
2. Energy monitoring devices
3. Smart thermostats
4. Automated lighting systems

**Monthly Savings Potential: 20-30%**"""

    elif any(word in prompt for word in ['solar', 'renewable', 'panels']):
        return """☀️ **Solar & Renewable Energy Options:**

🔋 **Solar Panel Benefits:**
- Average 25-year savings: $20,000-$50,000
- Typical payback period: 6-10 years
- Reduce carbon footprint by 80%
- Increase home value by 4%

💰 **Financial Incentives:**
- Federal tax credit: 30% (through 2032)
- State rebates available
- Net metering programs
- Power purchase agreements (PPAs)

📊 **Your Solar Potential:**
Based on your location and roof size:
- Estimated system size: 6-8 kW
- Annual production: 8,000-12,000 kWh
- Monthly savings: $80-120

**Next Steps:** Get a free solar assessment!"""

    elif any(word in prompt for word in ['appliance', 'refrigerator', 'ac', 'washer', 'dryer']):
        return """🏠 **Smart Appliance Recommendations:**

❄️ **Refrigerator (20% of energy use):**
- ENERGY STAR models use 15% less energy
- Optimal temperature: 37-40°F (fridge), 5°F (freezer)
- Keep coils clean, check door seals

🌀 **Air Conditioning (35% of energy use):**
- Upgrade to high SEER rating (16+ recommended)
- Regular filter changes (monthly)
- Smart thermostats save 10-15%

👕 **Washer & Dryer (10% of energy use):**
- Use cold water (90% of energy goes to heating)
- Clean dryer lint after every load
- Consider heat pump dryers

🔥 **Water Heater (20% of energy use):**
- Tankless units are 30% more efficient
- Lower temperature to 120°F
- Insulate tank and pipes

**Upgrade Priority: AC → Water Heater → Refrigerator**"""

    elif any(word in prompt for word in ['hello', 'hi', 'help', 'start']):
        return """👋 **Welcome to Smart Energy AI!**

I'm here to help you optimize your energy usage and save money! Here's what I can assist you with:

🔍 **Energy Analysis:**
- Analyze your consumption patterns
- Identify energy waste areas
- Compare with similar homes

💰 **Cost Optimization:**
- Bill analysis and breakdown
- Money-saving strategies
- ROI calculations for upgrades

🏠 **Home Efficiency:**
- Appliance recommendations
- Insulation and weatherization tips
- Smart home technology advice

🌱 **Renewable Energy:**
- Solar panel feasibility
- Battery storage options
- Green energy programs

**Just ask me anything about energy efficiency, costs, or home improvements!**"""

    else:
        return f"""🤖 **AI Assistant Response:**

Thank you for your question about "{prompt}". I'm here to help with energy-related topics!

🔍 **Popular Topics I Can Help With:**
- Energy bill analysis and cost reduction
- Home appliance efficiency tips
- Solar panel and renewable energy options
- Smart home technology recommendations
- Seasonal energy optimization strategies

💡 **Quick Energy Tip:**
Did you know that adjusting your thermostat by just 2 degrees can save 10-15% on your energy bill?

**Feel free to ask me more specific questions about:**
- Your energy bills
- Appliance efficiency
- Home improvements
- Solar energy options
- Energy-saving tips

How can I help you save energy and money today?"""

# Sidebar with additional information
with st.sidebar:
    st.markdown("### 📊 Energy Dashboard")
    
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Monthly Usage", "450 kWh", "-15%")
    with col2:
        st.metric("Monthly Cost", "$67.50", "-$12")
    
    st.markdown("### 🎯 Quick Actions")
    if st.button("📋 Analyze My Bill"):
        st.session_state.messages.append({
            "role": "user", 
            "content": "Analyze my energy bill"
        })
        st.rerun()
    
    if st.button("💡 Energy Saving Tips"):
        st.session_state.messages.append({
            "role": "user", 
            "content": "Give me energy saving tips"
        })
        st.rerun()
    
    if st.button("☀️ Solar Options"):
        st.session_state.messages.append({
            "role": "user", 
            "content": "Tell me about solar panels"
        })
        st.rerun()
    
    st.markdown("---")
    st.markdown("### 🔗 Quick Links")
    st.markdown("- [Energy Calculator](https://energy-calculator.example.com)")
    st.markdown("- [Solar Savings](https://solar-calculator.example.com)")
    st.markdown("- [Rebates & Incentives](https://energy-rebates.example.com)")

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 2rem;">
    <p>🌱 Smart Energy AI Chatbot - Helping you save energy and money</p>
    <p>Powered by Advanced AI Technology</p>
</div>
""", unsafe_allow_html=True)