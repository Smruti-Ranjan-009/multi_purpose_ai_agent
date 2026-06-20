import os
import ssl
import certifi
from tavily import TavilyClient
from langchain.tools import tool
from dotenv import load_dotenv

load_dotenv()

@tool
def web_search(query: str) -> str:
    """Search the web for current and real-time information using Tavily."""
    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    results = client.search(query=query, max_results=5)
    
    if not results or "results" not in results:
        return "No results found."
    
    output = []
    for r in results["results"]:
        output.append(f"Title: {r.get('title', 'N/A')}\nURL: {r.get('url', 'N/A')}\nContent: {r.get('content', 'N/A')}")
    
    return "\n\n".join(output)