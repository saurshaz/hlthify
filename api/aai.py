from fastapi import HTTPException
from typing import Dict
import httpx
import os
import json
import re
import logging
import google.generativeai as genai
from google.generativeai.types import GenerateContentResponse

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def generate_summary_gemini(text: str) -> Dict:
    """
    Generate a standardized summary using the Gemini API.
    """
    # Configure the Gemini API with your API key
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    # Define the prompt for the Gemini model
    prompt = f"""
    Please analyze this document and extract key information in a structured format.
    Return only a JSON object with an appropriate structure. Keep two nodes for summary and recommendations, apart from other data.
    Document text:
    {text}
    """

    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-1.5-pro')  # Use the appropriate Gemini model

        # Generate content using the Gemini API
        response: GenerateContentResponse = model.generate_content(prompt)

        # Extract the generated text from the response
        content = response.text.strip()

        # Ensure we get valid JSON
        try:
            # Pattern to extract JSON if wrapped in markdown or other formatting
            pattern = r"```json([^`]*)```"

            # Search for the pattern in the input text
            match = re.search(pattern, content, re.DOTALL)
            if match:
                # Extract the JSON string from the matched group
                json_str = match.group(1).strip()
            else:
                # If no JSON block is found, assume the entire content is JSON
                json_str = content

            # Parse the JSON string into a Python dictionary
            json_obj = json.loads(json_str)

            # Add any additional metadata if needed
            json_obj['think'] = "Extracted from Gemini API response"

            return json_obj

        except json.JSONDecodeError:
            logger.error("Failed to parse Gemini API response as JSON")
            raise HTTPException(status_code=500, detail="Invalid response format")

    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating summary")

async def generate_summary(text: str) -> Dict:
    """
    Generate a standardized summary using OpenRouter AI
    """
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    Please analyze this document and extract key information in a structured format.
    Return only a JSON object with an approptiate structure:. keep two nodes for summary and recommendations, apart from other data.
    Document text:
    {text}
    """

    try:
        # import hishel
        # with hishel.CacheClient() as client:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                OPENROUTER_URL,
                headers=headers,
                json={
                    "model":"cognitivecomputations/dolphin3.0-r1-mistral-24b:free",  # or another model
                    "messages": [
                        {"role": "system", "content": "You are a medical report analyzer that returns structured JSON only."},
                        {"role": "user", "content": prompt}
                    ]
                }
            )
            
            if response.status_code != 200:
                logger.error(f"OpenRouter API error: {response.text}")
                raise HTTPException(status_code=500, detail="Error generating summary")
            
            # Extract the JSON from the response
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Ensure we get valid JSON
            try:
                pattern = r"<think>([^<]*)<\/think>.*```json([^`]*)```"

                # Search for the pattern in the input text
                match = re.search(pattern, content, re.DOTALL)
                if match is None:
                    json_obj = {'obj': content}
                else:    
                    # import pdb;pdb.set_trace()
                    if match:
                        # Extract the JSON string from the matched group
                        json_str = match.group(2)
                        meta_str = match.group(1)
                    else:
                        json_str = content

                    # import pdb;pdb.set_trace()
                    json_obj = json.loads(json_str)
                    json_obj['think'] = meta_str
                print(json_obj)
                return json_obj
            except json.JSONDecodeError:
                logger.error("Failed to parse AI response as JSON")
                raise HTTPException(status_code=500, detail="Invalid response format")
                
    except Exception as e:
        print(e)
        logger.error(f"Error calling OpenRouter API: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating summary")

