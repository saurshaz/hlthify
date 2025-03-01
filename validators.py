from fastapi import HTTPException
import magic

def validate_file_type(content: bytes) -> str:
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(content)
    
    allowed_types = ['application/pdf', 'text/plain']
    if file_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_type} not supported. Please upload PDF or text files only."
        )
    return file_type

def validate_file_size(content: bytes, max_size_mb: int = 10) -> None:
    file_size = len(content) / (1024 * 1024)  # Convert to MB
    if file_size > max_size_mb:
        raise HTTPException(
            status_code=400,
            detail=f"File size ({file_size:.2f}MB) exceeds maximum allowed size of {max_size_mb}MB"
        )
