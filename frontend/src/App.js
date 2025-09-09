import React, { useState, useRef, useEffect } from "react";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);

  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!pdfFile) {
    alert("Please select a PDF file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("file", pdfFile);

  try {
    const res = await fetch("http://127.0.0.1:8080/upload-pdf/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadMessage(data.message || "Upload successful.");
  } catch (error) {
    setUploadMessage("Upload failed.");
    console.error(error);
  }
};

const handleAsk = async () => {
  if (!question.trim()) return;

  setChat((prev) => [...prev, { user: question, bot: "..." }]);
  setQuestion("");

  try {
    const res = await fetch("http://127.0.0.1:8080/ask-question/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    setChat((prev) => {
      const newChat = [...prev];
      newChat[newChat.length - 1].bot = data.answer || "No answer";
      return newChat;
    });
  } catch (error) {
    setChat((prev) => {
      const newChat = [...prev];
      newChat[newChat.length - 1].bot = "Error getting answer";
      return newChat;
    });
    console.error(error);
  }
};

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>PDF Q&A Chatbot</h1>

      <div style={styles.uploadSection}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} style={styles.uploadButton}>Upload PDF</button>
        <div style={styles.uploadMessage}>{uploadMessage}</div>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.chatMessages}>
          {chat.length === 0 && (
            <div style={styles.emptyMessage}>Ask questions about the uploaded PDF here.</div>
          )}
          {chat.map((entry, idx) => (
            <div key={idx} style={styles.messagePair}>
              <div style={styles.userMessage}>{entry.user}</div>
              <div style={styles.botMessage}>{entry.bot}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            style={styles.inputBox}
          />
          <button onClick={handleAsk} style={styles.askButton}>Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: 600,
    margin: "20px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  uploadSection: {
    marginBottom: 15,
  },
  uploadButton: {
    marginLeft: 10,
    padding: "6px 12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  uploadMessage: {
    marginTop: 8,
    color: "#007700",
    fontWeight: "600",
  },
  chatContainer: {
    border: "1px solid #ddd",
    borderRadius: 8,
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  chatMessages: {
    flexGrow: 1,
    padding: 16,
    overflowY: "auto",
  },
  messagePair: {
    marginBottom: 24,
  },
  userMessage: {
    maxWidth: "70%",
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 16px",
    borderRadius: "20px 20px 0 20px",
    marginLeft: "auto",
    fontSize: 16,
  },
  botMessage: {
    maxWidth: "70%",
    backgroundColor: "#e4e6eb",
    color: "#111",
    padding: "10px 16px",
    borderRadius: "20px 20px 20px 0",
    marginTop: 6,
    fontSize: 16,
  },
  inputArea: {
    borderTop: "1px solid #ddd",
    padding: 12,
    display: "flex",
    alignItems: "center",
  },
  inputBox: {
    flexGrow: 1,
    padding: "10px 15px",
    fontSize: 16,
    borderRadius: 20,
    border: "1px solid #ccc",
  },
  askButton: {
    marginLeft: 12,
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    padding: "10px 18px",
    fontWeight: "600",
    fontSize: 16,
    borderRadius: 20,
    cursor: "pointer",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: 60,
    fontSize: 16,
  },
};

export default App;