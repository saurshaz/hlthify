from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
import uvicorn
import PyPDF2
import io
import json
import re
import logging
from typing_extensions import TypedDict
import pdfplumber
from paddleocr import PaddleOCR
from PIL import Image
import io



logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')  # Set language to English
app = FastAPI(title="Medical Report Parser API", description="API for parsing and standardizing medical reports", version="1.0.0")
templates = Jinja2Templates(directory="api/templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# class Demographics(BaseModel):
#     name: Optional[str] = Field(default=None)
#     age: Optional[int] = Field(default=None)
#     gender: Optional[str] = Field(default=None)

# class ClinicalDetails(BaseModel):
#     notes: List[str] = Field(default_factory=list)

# class PatientInfo(BaseModel):
#     demographics: Demographics = Field(default_factory=Demographics)
#     clinical_details: ClinicalDetails = Field(default_factory=ClinicalDetails)

# class HaematologyData(BaseModel):
#     complete_blood_count: Dict[str, Any] = Field(default_factory=dict)
#     notes: List[str] = Field(default_factory=list)

# class BiochemistryData(BaseModel):
#     metabolic_panel: Dict[str, Any] = Field(default_factory=dict)
#     notes: List[str] = Field(default_factory=list)

# class LaboratoryResults(BaseModel):
#     haematology: HaematologyData = Field(default_factory=HaematologyData)
#     biochemistry: BiochemistryData = Field(default_factory=BiochemistryData)

# class Summary(BaseModel):
#     interpretation: List[str] = Field(default_factory=list)
#     recommendations: List[str] = Field(default_factory=list)

# class StandardizedReport(BaseModel):
#     patient_info: PatientInfo = Field(default_factory=PatientInfo)
#     laboratory_results: LaboratoryResults = Field(default_factory=LaboratoryResults)
#     summary: Summary = Field(default_factory=Summary)

def extract_text_from_pdf(contents):
    """Extract text from all pages of a PDF using pdfplumber."""
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

# def parse_text_to_json(text):
#     """
#     Parse the extracted text into a structured JSON object.
#     This function assumes a semi-structured format and extracts key-value pairs.
#     Modify it based on your document's format.
#     """
#     lines = text.split("\n")
#     data = {}
#     current_section = None
    
#     for line in lines:
#         line = line.strip()
#         if not line:
#             continue
        
#         # Identify section headers (e.g., "HAEMATOLOGY", "CLINICAL BIOCHEMISTRY")
#         if line.isupper() and ":" not in line:
#             current_section = line.lower().replace(" ", "_")
#             data[current_section] = {}
#             continue
        
#         # Extract key-value pairs
#         if ":" in line:
#             key, value = line.split(":", 1)
#             key = key.strip().lower().replace(" ", "_")
#             value = value.strip()
            
#             if current_section:
#                 data[current_section][key] = value
#             else:
#                 data[key] = value
#         else:
#             data['extras'] = line
    
#     return data


def parse_text_to_json(text):
    lines = text.split("\n")
    data = {}
    current_section = None
    section_content = []
    
    def process_line_with_colon(line):
        # Handle cases where there might be multiple colons
        try:
            key, value = line.split(":", 1)
            key = key.strip().lower().replace(" ", "_")
            value = value.strip()
            if not value:  # If value is empty, store as None
                value = None
            return key, value
        except ValueError:
            return None, line

    def store_section_content():
        if current_section and section_content:
            # Process accumulated content
            section_data = {}
            unstructured_content = []
            
            for content in section_content:
                if ":" in content:
                    key, value = process_line_with_colon(content)
                    if key:
                        section_data[key] = value
                    else:
                        unstructured_content.append(content)
                else:
                    unstructured_content.append(content)
            
            # Store both structured and unstructured content
            if section_data:
                data[current_section]["structured_data"] = section_data
            if unstructured_content:
                data[current_section]["unstructured_text"] = unstructured_content

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check for section headers (all caps, might include numbers)
        if line.isupper() or (any(c.isupper() for c in line) and all(c.isupper() or c.isdigit() or c in ' -/' for c in line)):
            # Store previous section's content before starting new section
            store_section_content()
            
            # Start new section
            current_section = line.lower().replace(" ", "_")
            data[current_section] = {}
            section_content = []
            continue

        # Accumulate content for current section
        if current_section:
            section_content.append(line)
        else:
            # Handle content before any section is defined
            if ":" in line:
                key, value = process_line_with_colon(line)
                if key:
                    data[key] = value
                else:
                    if "general" not in data:
                        data["general"] = {"unstructured_text": []}
                    data["general"]["unstructured_text"].append(line)
            else:
                if "general" not in data:
                    data["general"] = {"unstructured_text": []}
                data["general"]["unstructured_text"].append(line)

    # Process the last section
    store_section_content()

    return data

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_content = await file.read()

        if file.filename.lower().endswith('.pdf'):
            text_content = extract_text_from_pdf(file_content)
            if text_content is None:
                return JSONResponse({"error": "Failed to extract text from PDF"}, status_code=400)

            parsed_data = parse_text_to_json(text_content)
            text_content = file_content.decode('utf-8')
            return {"filename": file.filename, "status": "success", "data": parsed_data}
        else:
            return JSONResponse({"error": "File must be a PDF or text file"}, status_code=400)
    except Exception as e:
            return JSONResponse({"error": f"Failed to parse text: {str(e)}"}, status_code=400)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

@app.get("/upload")
async def upload_form(request: Request):
    return templates.TemplateResponse("upload.html", {"request": request})

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app", host="0.0.0.0", port=8088, reload=True)
