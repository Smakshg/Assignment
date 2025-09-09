from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from rag_query import load_documents_and_index, generate_answer
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for React frontend at localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

file_indexed = False  # Flag to indicate if a PDF has been uploaded and processed

class QuestionRequest(BaseModel):
    question: str

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    global file_indexed
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Process the uploaded PDF and build the index
    load_documents_and_index(file_location)
    file_indexed = True
    return {"message": "File uploaded and indexed successfully."}

@app.post("/ask-question/")
async def ask_question(request: QuestionRequest):
    global file_indexed
    if not file_indexed:
        return {"error": "Please upload and process a PDF first."}
    answer = generate_answer(request.question)
    return {"answer": answer}