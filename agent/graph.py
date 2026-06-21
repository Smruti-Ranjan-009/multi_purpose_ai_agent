from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from typing import TypedDict, Annotated, Sequence
import operator
import os
from dotenv import load_dotenv

load_dotenv()

from agent.tools.search import web_search
from agent.tools.weather import get_weather
from agent.tools.analyst import analyse_data
from agent.tools.rag import search_documents

# ── LLM Selection based on environment ───────────────────────
USE_GROQ = os.getenv("USE_GROQ", "false").lower() == "true"

if USE_GROQ:
    from langchain_groq import ChatGroq
    llm = ChatGroq(model="llama-3.2-3b-preview", temperature=0)
else:
    from langchain_ollama import ChatOllama
    llm = ChatOllama(
        model="qwen2.5:3b",
        temperature=0,
        num_gpu=1,
        num_ctx=2048
    )

# ── State Definition ──────────────────────────────────────────
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]

# ── Tools ─────────────────────────────────────────────────────
tools = [web_search, get_weather, analyse_data, search_documents]
llm_with_tools = llm.bind_tools(tools)

# ── Nodes ─────────────────────────────────────────────────────
def call_llm(state: AgentState):
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

# ── Graph ─────────────────────────────────────────────────────
tool_node = ToolNode(tools)

graph = StateGraph(AgentState)
graph.add_node("llm", call_llm)
graph.add_node("tools", tool_node)

graph.set_entry_point("llm")
graph.add_conditional_edges("llm", tools_condition)
graph.add_edge("tools", "llm")

agent = graph.compile()

# ── Entry Point ───────────────────────────────────────────────
def run_agent(user_input: str, chat_history: list = []) -> str:
    try:
        messages = []
        for msg in chat_history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))

        messages.append(HumanMessage(content=user_input))

        result = agent.invoke({"messages": messages})
        return result["messages"][-1].content

    except Exception as e:
        return f"Agent error: {str(e)}"