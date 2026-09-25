import pytest

from chunking import chunk_text


def test_texto_curto_vira_um_chunk():
    assert chunk_text("React e Node.js") == ["React e Node.js"]


def test_ignora_linhas_vazias():
    assert chunk_text("a\n\n\nb", max_chars=100, overlap=10) == ["a\nb"]


def test_respeita_limite_de_tamanho():
    texto = "\n".join(["x" * 300] * 5)
    chunks = chunk_text(texto, max_chars=800, overlap=100)
    assert len(chunks) > 1
    assert all(len(c) <= 800 for c in chunks)


def test_paragrafo_gigante_e_fatiado_com_overlap():
    texto = "".join(str(i % 10) for i in range(2000))
    chunks = chunk_text(texto, max_chars=500, overlap=100)
    assert all(len(c) <= 500 for c in chunks)
    # o final de um chunk reaparece no início do próximo
    assert chunks[0][-100:] == chunks[1][:100]


@pytest.mark.parametrize("max_chars,overlap", [(0, 0), (100, 100), (100, -1)])
def test_parametros_invalidos(max_chars, overlap):
    with pytest.raises(ValueError):
        chunk_text("abc", max_chars=max_chars, overlap=overlap)
