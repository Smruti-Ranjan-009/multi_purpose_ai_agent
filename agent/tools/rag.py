import os
from langchain.tools import tool
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

VECTORSTORE_DIR = "vectorstore"
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def ingest_document(filepath: str) -> str:
    """Load and store a document into ChromaDB."""
    if filepath.endswith(".pdf"):
        loader = PyPDFLoader(filepath)
    else:
        loader = TextLoader(filepath)

    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    vectorstore = Chroma(
        persist_directory=VECTORSTORE_DIR,
        embedding_function=embeddings
    )
    vectorstore.add_documents(chunks)
    return f"✅ Ingested {len(chunks)} chunks from {os.path.basename(filepath)}"

@tool
def search_documents(query: str) -> str:
    """Search through uploaded documents to answer questions using RAG."""
    vectorstore = Chroma(
        persist_directory=VECTORSTORE_DIR,
        embedding_function=embeddings
    )
    results = vectorstore.similarity_search(query, k=3)

    if not results:
        return "No relevant content found in uploaded documents."

    return "\n\n".join([
        f"[Source: {r.metadata.get('source', 'unknown')}]\n{r.page_content}"
        for r in results
    ])