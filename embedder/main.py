import os
from functools import lru_cache

from fastapi import FastAPI
from pydantic import BaseModel, Field

from chunking import chunk_text

MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

app = FastAPI(title="VagaMatch Embedder")


@lru_cache(maxsize=1)
def get_model():
    # Import tardio: os testes de chunking não precisam baixar o modelo
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(MODEL_NAME)


class EmbedRequest(BaseModel):
    texts: list[str] = Field(min_length=1)


class ChunkEmbedRequest(BaseModel):
    text: str = Field(min_length=1)
    max_chars: int = 800
    overlap: int = 150


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model": MODEL_NAME}


@app.post("/embed")
def embed(req: EmbedRequest) -> dict:
    vectors = get_model().encode(req.texts, normalize_embeddings=True).tolist()
    return {"embeddings": vectors, "dim": len(vectors[0])}


@app.post("/chunk-embed")
def chunk_embed(req: ChunkEmbedRequest) -> dict:
    chunks = chunk_text(req.text, req.max_chars, req.overlap)
    vectors = get_model().encode(chunks, normalize_embeddings=True).tolist()
    return {"chunks": [{"idx": i, "content": c, "embedding": v} for i, (c, v) in enumerate(zip(chunks, vectors))]}
