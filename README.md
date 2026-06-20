# 🤖 Multi-Purpose AI Agent

A production-grade AI agent built with **LangGraph**, **FastAPI**, and **React** that autonomously decides which tool to use based on your query — powered by a local LLM via Ollama.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![LangGraph](https://img.shields.io/badge/LangGraph-latest-orange)
![Ollama](https://img.shields.io/badge/Ollama-qwen2.5:3b-purple)

---

## ✨ Features

| Tool | Description |
|---|---|
| 🔍 **Web Search** | Real-time web search via Tavily API |
| 🌤️ **Weather** | Current weather for any city via OpenWeatherMap |
| 📄 **RAG** | Upload PDF/TXT documents and ask questions about them |
| 📊 **Data Analysis** | Upload CSV files for automatic statistical analysis with interactive charts |

---

## 🏗️ Architecture

```
React Frontend (Vite · localhost:5173)
        ↓
FastAPI Backend (Uvicorn · localhost:8000)
        ↓
LangGraph Agent (ReAct Pattern)
        ↓
┌─────────────────────────────────────┐
│  🔍 Tavily Web Search               │
│  🌤️  OpenWeatherMap API             │
│  📄 RAG (ChromaDB + MiniLM)         │
│  📊 Pandas Data Analysis + Recharts │
└─────────────────────────────────────┘
        ↓
Ollama (qwen2.5:3b — runs locally)
```

---

## 🗂️ Project Structure

```
multi_purpose_ai_agent/
├── agent/
│   ├── graph.py              # LangGraph agent definition
│   ├── memory.py             # Conversation memory
│   └── tools/
│       ├── search.py         # Tavily web search
│       ├── weather.py        # OpenWeatherMap
│       ├── analyst.py        # Pandas auto data analysis
│       └── rag.py            # ChromaDB RAG pipeline
├── backend/
│   └── main.py               # FastAPI server
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── ChatWindow.jsx
│           ├── MessageBubble.jsx
│           ├── Sidebar.jsx
│           └── DataDashboard.jsx
├── tests/
│   └── test_backend.py
├── vectorstore/              # ChromaDB persistent storage
├── uploads/                  # Uploaded files
├── logs/                     # Application logs
├── .env.example
└── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com/download) installed

### 1. Clone the repository

```bash
git clone https://github.com/perryvegehan/multi-purpose-ai-agent.git
cd multi-purpose-ai-agent
```

### 2. Set up Python environment

```bash
conda create -n ai-agent python=3.11 -y
conda activate ai-agent
pip install -r requirements.txt
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your API keys in `.env`:

```
OPENWEATHER_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

### 4. Pull the Ollama model

```bash
ollama pull qwen2.5:3b
```

### 5. Create required folders

```bash
mkdir logs uploads vectorstore
```

### 6. Start the backend

```bash
uvicorn backend.main:app --reload --port 8000
```

### 7. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 8. Open the app

Visit `http://localhost:5173` 🎉

---

## 🔑 API Keys

| Key | Where to get it | Free tier |
|---|---|---|
| `OPENWEATHER_API_KEY` | [openweathermap.org](https://openweathermap.org/api) | ✅ Yes |
| `TAVILY_API_KEY` | [tavily.com](https://tavily.com) | ✅ 1000/month |

---

## 🧪 Running Tests

```bash
pytest tests/ -v
```

---

## 💬 Example Queries

```
# Web Search
What are the latest news in AI today?

# Weather
What is the weather in Mumbai?

# RAG (after uploading a PDF)
What are the key skills mentioned in this resume?

# Data Analysis (after uploading a CSV)
Analyse sales.csv
```

---

## 🛠️ Tech Stack

**Backend**
- FastAPI + Uvicorn
- LangGraph (ReAct agent)
- LangChain (tool definitions)
- ChromaDB (vector store)
- sentence-transformers (embeddings)
- Pandas + Matplotlib (data analysis)

**Frontend**
- React 18 + Vite
- Recharts (interactive charts)
- Axios (HTTP client)
- react-markdown (markdown rendering)

**LLM**
- Ollama (`qwen2.5:3b` — runs 100% locally)

---

## 📝 License

MIT License — feel free to use and modify.
