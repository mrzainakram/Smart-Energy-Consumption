import os
import json
import base64
import cv2
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import pytesseract
from PIL import Image
import re

# Configure Tesseract path (adjust for your system)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows
# pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'  # Linux/Mac

def extract_text_from_image(image_path):
    """Extract text from image using OCR"""
    try:
        # Read image
        image = cv2.imread(image_path)
        if image is None:
            return None
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply preprocessing
        # Noise reduction
        denoised = cv2.medianBlur(gray, 3)
        
        # Thresholding
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Extract text using Tesseract
        text = pytesseract.image_to_string(thresh)
        
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

def extract_bill_data(text):
    """Extract bill data from OCR text"""
    if not text:
        return None
    
    data = {
        'units': None,
        'amount': None,
        'date': None,
        'meter_number': None
    }
    
    # Convert text to lowercase for easier matching
    text_lower = text.lower()
    
    # Extract units (look for patterns like "Units: 123" or "Consumption: 123 kWh")
    unit_patterns = [
        r'units?\s*:?\s*(\d+(?:\.\d+)?)',
        r'consumption\s*:?\s*(\d+(?:\.\d+)?)',
        r'kwh\s*:?\s*(\d+(?:\.\d+)?)',
        r'(\d+(?:\.\d+)?)\s*kwh',
        r'(\d+(?:\.\d+)?)\s*units'
    ]
    
    for pattern in unit_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['units'] = float(match.group(1))
            break
    
    # Extract amount (look for currency patterns)
    amount_patterns = [
        r'amount\s*:?\s*[\$₹€£]?\s*(\d+(?:\.\d+)?)',
        r'total\s*:?\s*[\$₹€£]?\s*(\d+(?:\.\d+)?)',
        r'bill\s*amount\s*:?\s*[\$₹€£]?\s*(\d+(?:\.\d+)?)',
        r'[\$₹€£]\s*(\d+(?:\.\d+)?)',
        r'(\d+(?:\.\d+)?)\s*[\$₹€£]'
    ]
    
    for pattern in amount_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['amount'] = float(match.group(1))
            break
    
    # Extract date
    date_patterns = [
        r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        r'(\d{4}[/-]\d{1,2}[/-]\d{1,2})',
        r'(\w+\s+\d{1,2},?\s+\d{4})'
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            data['date'] = match.group(1)
            break
    
    # Extract meter number
    meter_patterns = [
        r'meter\s*no\.?\s*:?\s*(\d+)',
        r'meter\s*number\s*:?\s*(\d+)',
        r'account\s*no\.?\s*:?\s*(\d+)',
        r'(\d{8,12})'  # Generic long number pattern
    ]
    
    for pattern in meter_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['meter_number'] = match.group(1)
            break
    
    return data

@csrf_exempt
def scan_bill(request):
    """Scan bill image and extract data"""
    if request.method == 'POST':
        try:
            # Check if file is uploaded
            if 'bill_image' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'message': 'No image file uploaded'
                }, status=400)
            
            # Get uploaded file
            uploaded_file = request.FILES['bill_image']
            
            # Validate file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']
            if uploaded_file.content_type not in allowed_types:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid file type. Please upload an image file.'
                }, status=400)
            
            # Save file temporarily
            file_name = f"bill_{uploaded_file.name}"
            file_path = default_storage.save(file_name, ContentFile(uploaded_file.read()))
            full_path = default_storage.path(file_path)
            
            try:
                # Extract text from image
                text = extract_text_from_image(full_path)
                
                if not text:
                    return JsonResponse({
                        'success': False,
                        'message': 'Could not extract text from image. Please ensure the image is clear and readable.'
                    }, status=400)
                
                # Extract bill data
                bill_data = extract_bill_data(text)
                
                if not bill_data:
                    return JsonResponse({
                        'success': False,
                        'message': 'Could not extract bill data from image. Please ensure the bill is clearly visible.'
                    }, status=400)
                
                # Clean up temporary file
                default_storage.delete(file_path)
                
                return JsonResponse({
                    'success': True,
                    'message': 'Bill scanned successfully',
                    'data': bill_data,
                    'extracted_text': text[:500] + '...' if len(text) > 500 else text  # Return first 500 chars for debugging
                })
                
            except Exception as e:
                # Clean up temporary file
                default_storage.delete(file_path)
                raise e
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error processing image: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_bill_history(request):
    """Get bill history for a user"""
    if request.method == 'GET':
        try:
            # In a real application, you would get the user from the token
            # For now, return mock data
            mock_history = [
                {
                    'month': 'January 2024',
                    'units': 320,
                    'amount': 45.60,
                    'date': '2024-01-31'
                },
                {
                    'month': 'February 2024',
                    'units': 310,
                    'amount': 43.20,
                    'date': '2024-02-29'
                },
                {
                    'month': 'March 2024',
                    'units': 340,
                    'amount': 48.80,
                    'date': '2024-03-31'
                },
                {
                    'month': 'April 2024',
                    'units': 330,
                    'amount': 46.40,
                    'date': '2024-04-30'
                },
                {
                    'month': 'May 2024',
                    'units': 360,
                    'amount': 52.00,
                    'date': '2024-05-31'
                },
                {
                    'month': 'June 2024',
                    'units': 380,
                    'amount': 55.20,
                    'date': '2024-06-30'
                }
            ]
            
            return JsonResponse({
                'success': True,
                'data': mock_history
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405) 