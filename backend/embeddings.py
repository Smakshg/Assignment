import openai
import faiss
import numpy as np
from myconfig import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

def get_embedding(text, model="text-embedding-ada-002"):
    response = openai.embeddings.create(input=text, model=model)
    embedding = response.data[0].embedding
    return np.array(embedding).astype('float32')

class VectorStore:
    def __init__(self, dim=1536):
        self.dim = dim
        self.index = faiss.IndexFlatL2(dim)
        self.texts = []

    def add_texts(self, texts):
        embeddings = [get_embedding(t) for t in texts]
        vectors = np.vstack(embeddings)
        self.index.add(vectors)
        self.texts.extend(texts)

    def search(self, query, top_k=5):
        q_vec = get_embedding(query).reshape(1, -1)
        distances, indices = self.index.search(q_vec, top_k)
        results = [self.texts[i] for i in indices[0]]
        return results