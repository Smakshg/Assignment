from embeddings import VectorStore
import openai
from myconfig import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

vector_store = VectorStore()

print("rag_query.py loaded")

def load_documents_and_index(file_path):
    from pdf_processing import extract_text_from_pdf, chunk_text
    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)
    vector_store.add_texts(chunks)

def generate_answer(question):
    # Retrieve relevant chunks using your vector store
    relevant_chunks = vector_store.search(question)

    context = "\n\n".join(relevant_chunks)
    system_prompt = "You are an intelligent assistant helping answer questions based on the provided context."

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}\nAnswer:"}
    ]

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.0,
        max_tokens=200,
        n=1,
    )

    answer = response.choices[0].message.content.strip()
    return answer