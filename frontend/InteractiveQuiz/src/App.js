import React, { useState } from "react";

const questions = [
  {
    id: 1,
    text: "What's your monthly budget for rent?",
    options: ["Under $a", "$a–$b", "$b–$c", "Over $c"],
  },
  {
    id: 2,
    text: "Which city or region are you interested in?",
    options: ["Seoul", "Busan", "Incheon", "Other"],
  },
  {
    id: 3,
    text: "Do you prefer furnished housing?",
    options: ["Yes", "No", "Doesn't matter"],
  },
  {
    id: 4,
    text: "What housing type do you prefer?",
    options: ["One-room", "Two-room", "Officetel", "Shared house"],
  },
  {
    id: 5,
    text: "Do you speak Korean?",
    options: ["Fluent", "Basic", "No"],
  },
];

function App() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [questions[current].id]: option };
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setAnswers({});
    setDone(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "2rem", backgroundColor: "#fafafa" }}>
        {!done ? (
          <>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
              {questions[current].text}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {questions[current].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "5px",
                    border: "1px solid #007bff",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#e7f0ff")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Your Preferences</h2>
            <ul style={{ paddingLeft: "1rem" }}>
              {questions.map((q) => (
                <li key={q.id} style={{ marginBottom: "0.5rem" }}>
                  <strong>{q.text}</strong>: {answers[q.id]}
                </li>
              ))}
            </ul>
            <button
              onClick={restart}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "5px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Restart Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
