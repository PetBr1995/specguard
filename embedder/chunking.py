"""Divisão de texto em chunks com sobreposição, respeitando parágrafos."""


def chunk_text(text: str, max_chars: int = 800, overlap: int = 150) -> list[str]:
    if max_chars <= 0:
        raise ValueError("max_chars deve ser > 0")
    if not 0 <= overlap < max_chars:
        raise ValueError("overlap deve estar entre 0 e max_chars - 1")

    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        # Parágrafo maior que o limite: fatiar em janelas com overlap
        while len(para) > max_chars:
            if current:
                chunks.append(current)
                current = ""
            chunks.append(para[:max_chars])
            para = para[max_chars - overlap:]

        candidate = f"{current}\n{para}" if current else para
        if len(candidate) <= max_chars:
            current = candidate
        else:
            chunks.append(current)
            tail = current[-overlap:] if overlap else ""
            current = f"{tail}\n{para}" if tail else para
            if len(current) > max_chars:
                current = para

    if current:
        chunks.append(current)
    return chunks
