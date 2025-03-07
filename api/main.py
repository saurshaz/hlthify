from fastapi import FastAPI, UploadFile, File, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
import uvicorn
# import PyPDF2
import io
import httpx
import os
import json
import re
import logging
from typing_extensions import TypedDict
import pdfplumber
from paddleocr import PaddleOCR
from PIL import Image
import io
from aai import generate_summary, generate_summary_gemini
from dotenv import load_dotenv



# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')  # Set language to English
app = FastAPI(title="Medical Report Parser API", description="API for parsing and standardizing medical reports", version="1.0.0")
templates = Jinja2Templates(directory="api/templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Replace with your frontend URL
    allow_credentials=True,  # Allow cookies/credentials
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Allowed HTTP methods
    allow_headers=["*"],  # Allowed headers
)

def extract_text_from_pdf(contents):
    """Extract text from all pages of a PDF using pdfplumber."""
    try:
        # Extract text using pdfplumber 
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            text_pages = []
            for page in pdf.pages:
                text = page.extract_text()
                if not text:  # If no text is found, use OCR
                    image = page.to_image(resolution=300).original
                    ocr_result = ocr.ocr(image, cls=True)
                    text = "\n".join([line[1][0] for line in ocr_result])
                text_pages.append(text)
        return "\n".join(text_pages)
    except Exception as e:
        return "\n".join([str(e)])

def parse_text_to_json(text):
    # Initialize the result dictionary
    result = {}

    # Split the text into sections based on headers
    sections = re.split(r"\n\s*\n", text.strip())

    for section in sections:
        # Extract the section header (if any)
        header_match = re.match(r"^([A-Z\s]+):", section)
        if header_match:
            header = header_match.group(1).strip().lower().replace(" ", "_")
            result[header] = {}
            current_dict = result[header]
        else:
            current_dict = result

        # Process key-value pairs in the section
        for line in section.split("\n"):
            if ":" in line:
                key, value = map(str.strip, line.split(":", 1))
                key = key.lower().replace(" ", "_")
                # Handle nested key-value pairs
                if "(" in key and ")" in key:
                    parent_key = re.sub(r"\(.*\)", "", key).strip()
                    sub_key = re.search(r"\((.*)\)", key).group(1).strip().lower().replace(" ", "_")
                    if parent_key not in current_dict:
                        current_dict[parent_key] = {}
                    current_dict[parent_key][sub_key] = value
                else:
                    current_dict[key] = value

    return result

def clean_text(text):
    # Remove non-printable characters
    text = ''.join(char for char in text if char.isprintable())
    # Remove multiple spaces
    text = ' '.join(text.split())
    return text



@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # import pdb;pdb.set_trace
    # print(f"Uploaded file: {file.filename}")
    # return {"message": "File uploaded successfully", "filename": file.filename}
    try:
        logger.info('called /upload')
        file_content = await file.read()

        if file.filename.lower().endswith('.pdf'):
            text_content = extract_text_from_pdf(file_content)
            if text_content is None:
                return JSONResponse({"error": "Failed to extract text from PDF"}, status_code=400)

            parsed_data = parse_text_to_json(clean_text(text_content))
            # summary = await generate_summary_gemini(parsed_data)

            summary = await generate_summary(parsed_data)
            return JSONResponse({"filename": file.filename, "status": "success", "data": parsed_data, "summary": summary }, status_code=200)# Generate summary using AI
        else:
            return JSONResponse({"error": "File must be a PDF or text file"}, status_code=400)
    except Exception as e:
            return JSONResponse({"error": f"Failed to parse text: {str(e)}"}, status_code=400)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

@app.get("/")
async def upload_form(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request})

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app", host="0.0.0.0", port=8088, reload=True)
