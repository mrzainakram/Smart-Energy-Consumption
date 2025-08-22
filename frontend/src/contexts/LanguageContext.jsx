import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  const translations = {
    english: {
      // Navigation
      'Smart Energy Consumption': 'Smart Energy Consumption',
      'AI-Powered Energy Management System': 'AI-Powered Energy Management System',
      'Contact': 'Contact',
      'Services': 'Services',
      'Logout': 'Logout',
      'Online': 'Online',
      
      // Dashboard
      'Manual Energy Input': 'Manual Energy Input',
      'Consumed Units (kWh)': 'Consumed Units (kWh)',
      'Bill Price (PKR)': 'Bill Price (PKR)',
      'Enter units consumed': 'Enter units consumed',
      'Enter bill amount': 'Enter bill amount',
      'Generate Prediction': 'Generate Prediction',
      'Scan Bill': 'Scan Bill',
      'Predict Appliance Energy': 'Predict Appliance Energy',
      
      // SECPARS
      'SECPARS AI Assistant': 'SECPARS AI Assistant',
      'Your Personal Energy Management Expert': 'Your Personal Energy Management Expert',
      'Get instant AI-powered insights about energy consumption, bill optimization, appliance efficiency, and personalized recommendations. Chat with SECPARS to make smarter energy decisions!': 'Get instant AI-powered insights about energy consumption, bill optimization, appliance efficiency, and personalized recommendations. Chat with SECPARS to make smarter energy decisions!',
      'CHAT WITH SECPARS': 'CHAT WITH SECPARS',
      'AI-Powered Insights': 'AI-Powered Insights',
      'Smart Recommendations': 'Smart Recommendations',
      'Real-time Analysis': 'Real-time Analysis',
      
      // About Us
      'About Us': 'About Us',
      'Our Mission': 'Our Mission',
      'What We Provide': 'What We Provide',
      'How It Helps You': 'How It Helps You',
      'Why Choose Us': 'Why Choose Us',
      
      // Contact
      'Email': 'Email',
      'Phone': 'Phone',
      'WhatsApp': 'WhatsApp',
      'Office Hours': 'Office Hours',
      'Monday - Friday: 9:00 AM - 6:00 PM': 'Monday - Friday: 9:00 AM - 6:00 PM',
      'Saturday: 10:00 AM - 4:00 PM': 'Saturday: 10:00 AM - 4:00 PM',
      'Sunday: Closed': 'Sunday: Closed',
      'Chat on WhatsApp': 'Chat on WhatsApp'
    },
    
    roman_urdu: {
      // Navigation
      'Smart Energy Consumption': 'Smart Energy Consumption',
      'AI-Powered Energy Management System': 'AI-Powered Energy Management System',
      'Contact': 'Contact',
      'Services': 'Services',
      'Logout': 'Logout',
      'Online': 'Online',
      
      // Dashboard
      'Manual Energy Input': 'Manual Energy Input',
      'Consumed Units (kWh)': 'Consumed Units (kWh)',
      'Bill Price (PKR)': 'Bill Price (PKR)',
      'Enter units consumed': 'Units consumed enter karo',
      'Enter bill amount': 'Bill amount enter karo',
      'Generate Prediction': 'Prediction generate karo',
      'Scan Bill': 'Bill scan karo',
      'Predict Appliance Energy': 'Appliance energy predict karo',
      
      // SECPARS
      'SECPARS AI Assistant': 'SECPARS AI Assistant',
      'Your Personal Energy Management Expert': 'Aapka Personal Energy Management Expert',
      'Get instant AI-powered insights about energy consumption, bill optimization, appliance efficiency, and personalized recommendations. Chat with SECPARS to make smarter energy decisions!': 'Energy consumption, bill optimization, appliance efficiency aur personalized recommendations ke liye instant AI-powered insights paayein. Smart energy decisions ke liye SECPARS se chat karein!',
      'CHAT WITH SECPARS': 'SECPARS SE CHAT KAREIN',
      'AI-Powered Insights': 'AI-Powered Insights',
      'Smart Recommendations': 'Smart Recommendations',
      'Real-time Analysis': 'Real-time Analysis',
      
      // About Us
      'About Us': 'Hamare Baare Mein',
      'Our Mission': 'Hamara Mission',
      'What We Provide': 'Hum Kya Provide Karte Hain',
      'How It Helps You': 'Ye Aapko Kaise Help Karta Hai',
      'Why Choose Us': 'Humko Kyun Choose Karein',
      
      // Contact
      'Email': 'Email',
      'Phone': 'Phone',
      'WhatsApp': 'WhatsApp',
      'Office Hours': 'Office Hours',
      'Monday - Friday: 9:00 AM - 6:00 PM': 'Monday - Friday: 9:00 AM - 6:00 PM',
      'Saturday: 10:00 AM - 4:00 PM': 'Saturday: 10:00 AM - 4:00 PM',
      'Sunday: Closed': 'Sunday: Closed',
      'Chat on WhatsApp': 'WhatsApp pe Chat Karein'
    },
    
    urdu: {
      // Navigation
      'Smart Energy Consumption': 'سمارٹ انرجی کنزیومپشن',
      'AI-Powered Energy Management System': 'اے آئی پاورڈ انرجی مینجمنٹ سسٹم',
      'Contact': 'رابطہ',
      'Services': 'خدمات',
      'Logout': 'لاگ آؤٹ',
      'Online': 'آن لائن',
      
      // Dashboard
      'Manual Energy Input': 'دستی انرجی انپٹ',
      'Consumed Units (kWh)': 'استعمال شدہ یونٹس (کلو واٹ گھنٹہ)',
      'Bill Price (PKR)': 'بل کی قیمت (پاکستانی روپے)',
      'Enter units consumed': 'استعمال شدہ یونٹس درج کریں',
      'Enter bill amount': 'بل کی رقم درج کریں',
      'Generate Prediction': 'پیش گوئی تیار کریں',
      'Scan Bill': 'بل اسکین کریں',
      'Predict Appliance Energy': 'آلات کی انرجی کی پیش گوئی کریں',
      
      // SECPARS
      'SECPARS AI Assistant': 'سیکپارس اے آئی اسسٹنٹ',
      'Your Personal Energy Management Expert': 'آپ کا ذاتی انرجی مینجمنٹ ماہر',
      'Get instant AI-powered insights about energy consumption, bill optimization, appliance efficiency, and personalized recommendations. Chat with SECPARS to make smarter energy decisions!': 'انرجی کی کھپت، بل کی بہتری، آلات کی کارکردگی اور ذاتی سفارشات کے بارے میں فوری اے آئی پاورڈ بصیرت حاصل کریں۔ ہوشیار انرجی کے فیصلے کرنے کے لیے سیکپارس سے چیٹ کریں!',
      'CHAT WITH SECPARS': 'سیکپارس سے چیٹ کریں',
      'AI-Powered Insights': 'اے آئی پاورڈ بصیرت',
      'Smart Recommendations': 'ہوشیار سفارشات',
      'Real-time Analysis': 'ریئل ٹائم تجزیہ',
      
      // About Us
      'About Us': 'ہمارے بارے میں',
      'Our Mission': 'ہمارا مشن',
      'What We Provide': 'ہم کیا فراہم کرتے ہیں',
      'How It Helps You': 'یہ آپ کی کیسے مدد کرتا ہے',
      'Why Choose Us': 'ہمیں کیوں منتخب کریں',
      
      // Contact
      'Email': 'ای میل',
      'Phone': 'فون',
      'WhatsApp': 'واٹس ایپ',
      'Office Hours': 'دفتری اوقات',
      'Monday - Friday: 9:00 AM - 6:00 PM': 'پیر - جمعہ: صبح 9:00 - شام 6:00',
      'Saturday: 10:00 AM - 4:00 PM': 'ہفتہ: صبح 10:00 - شام 4:00',
      'Sunday: Closed': 'اتوار: بند',
      'Chat on WhatsApp': 'واٹس ایپ پر چیٹ کریں'
    }
  };

  const translate = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    translate,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 