-- Fase 2 (RF9): vínculo semântico
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS requirements (
  id         SERIAL PRIMARY KEY,
  spec_path  TEXT NOT NULL,
  req_id     TEXT NOT NULL,
  text       TEXT NOT NULL,
  embedding  vector(384)
);

CREATE TABLE IF NOT EXISTS code_units (
  id         SERIAL PRIMARY KEY,
  path       TEXT NOT NULL,
  kind       TEXT NOT NULL CHECK (kind IN ('code', 'test')),
  name       TEXT,
  content    TEXT NOT NULL,
  embedding  vector(384)
);

CREATE INDEX IF NOT EXISTS code_units_embedding_hnsw ON code_units USING hnsw (embedding vector_cosine_ops);
