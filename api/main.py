from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from paddleocr import PaddleOCR
import pdfplumber
import io

app = FastAPI()

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read the uploaded file
        contents = await file.read()
        
        # Extract text from all pages of the PDF
        extracted_text = extract_text_from_pdf(contents)
        
        # Parse the extracted text into a structured JSON object
        parsed_data = parse_text_to_json(extracted_text)
        
        return JSONResponse(content={"message": "Text extracted successfully", "data": parsed_data})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

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

def parse_text_to_json(text):
    """
    Parse the extracted text into a structured JSON object.
    This function assumes a semi-structured format and extracts key-value pairs.
    Modify it based on your document's format.
    """
    lines = text.split("\n")
    data = {}
    current_section = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Identify section headers (e.g., "HAEMATOLOGY", "CLINICAL BIOCHEMISTRY")
        if line.isupper() and ":" not in line:
            current_section = line.lower().replace(" ", "_")
            data[current_section] = {}
            continue
        
        # Extract key-value pairs
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip().lower().replace(" ", "_")
            value = value.strip()
            
            if current_section:
                data[current_section][key] = value
            else:
                data[key] = value
    
    return data