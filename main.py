from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from paddleocr import PaddleOCR
from PIL import Image
import io
# from supabase import create_client, Client

# Initialize FastAPI
app = FastAPI()

# Supabase configuration
# SUPABASE_URL = "https://your-supabase-url.supabase.co"
# SUPABASE_KEY = "your-supabase-api-key"
# supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')  # Set language to English

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Convert to image using PIL
        image = Image.open(io.BytesIO(contents))
        image_path = "temp_image.png"
        image.save(image_path)
        
        # Extract text using PaddleOCR
        extracted_data = extract_text_with_paddleocr(image_path)
        
        # Store the extracted data in Supabase
        # response = supabase.table("extracted_data").insert({"file_name": file.filename, "data": extracted_data}).execute()
        
        return JSONResponse(content={"message": "Text extracted successfully", "data": extracted_data})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit-feedback/")
async def submit_feedback(feedback: dict):
    try:
        # Store feedback in Supabase
        # response = supabase.table("feedback").insert(feedback).execute()
        return JSONResponse(content={"message": "Feedback submitted successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def extract_text_with_paddleocr(image_path):
    """Extract text from an image using PaddleOCR."""
    result = ocr.ocr(image_path, cls=True)  # Perform OCR
    extracted_data = []
    
    for line in result:
        for word_info in line:
            bbox = word_info[0]  # Bounding box coordinates
            text = word_info[1][0]  # Extracted text
            confidence = word_info[1][1]  # Confidence score
            extracted_data.append({
                "text": text,
                "confidence": confidence,
                "bounding_box": bbox
            })
    
    return extracted_data