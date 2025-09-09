import openai
openai.api_key = "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"
response = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Say hello"}
    ],
)

print(response.choices[0].message.content)