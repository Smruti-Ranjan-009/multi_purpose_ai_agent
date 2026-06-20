from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
import logging
import pandas as pd
import numpy as np

from agent.graph import run_agent
from agent.tools.rag import ingest_document

# ── Logging Setup ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("logs/app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request Models ────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    chat_history: list = []

# ── Routes ────────────────────────────────────────────────────
@app.get("/")
def health_check():
    return {"status": "AI Agent backend is running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    logger.info(f"Chat request: {request.message}")
    response = run_agent(request.message, request.chat_history)
    logger.info(f"Chat response: {response[:100]}...")
    return {"response": response}

@app.post("/upload/document")
async def upload_document(file: UploadFile = File(...)):
    logger.info(f"Document uploaded: {file.filename}")
    save_path = os.path.join("uploads", file.filename)
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    result = ingest_document(save_path)
    return {"message": result}

@app.post("/upload/csv")
async def upload_csv(file: UploadFile = File(...)):
    logger.info(f"CSV uploaded: {file.filename}")
    save_path = os.path.join("uploads", file.filename)
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"message": f"✅ {file.filename} ready for analysis", "filename": file.filename}

@app.post("/analyse")
async def analyse(filename: str = Form(...)):
    filepath = os.path.join("uploads", filename)
    if not os.path.exists(filepath):
        return {"error": f"File {filename} not found"}

    logger.info(f"Analysing file: {filename}")
    df = pd.read_csv(filepath)
    numeric_cols = df.select_dtypes(include='number').columns.tolist()

    # Stats
    stats = []
    for col in numeric_cols:
        stats.append({
            "feature": col,
            "mean": round(float(df[col].mean()), 4),
            "std": round(float(df[col].std()), 4),
            "min": round(float(df[col].min()), 4),
            "max": round(float(df[col].max()), 4),
        })

    # Correlation
    corr = df[numeric_cols].corr()
    correlation = {
        "columns": numeric_cols,
        "matrix": [[round(float(corr.loc[r, c]), 4) for c in numeric_cols] for r in numeric_cols]
    }

    return {
        "stats": stats,
        "correlation": correlation,
        "columns": numeric_cols,
        "shape": {"rows": df.shape[0], "cols": df.shape[1]}
    }