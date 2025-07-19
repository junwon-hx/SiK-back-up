import React, { useState, useEffect, useCallback, useMemo } from "react";

const questions = [
  {
    id: 1,
    text: "Please choose your preferred language",
    options: ["English", "Korean", "Spanish", "Mandarin"],
  },
  {
    id: 2,
    text: "When do you plan to move in?",
    options: [
      "Within a month",
      "1-3 months",
      "3-6 months",
      "More than 6 months",
      "Not sure",
    ],
  },
  { id: 3, text: "Do you have a preferred location?", options: ["Yes", "No"] },
  {
    id: 4,
    text: "What are your biggest concerns?",
    options: [
      "Price",
      "Neighborhood Safety",
      "Scams",
      "Communication issues",
      "Condition of the property",
    ],
  },
  {
    id: 5,
    text: "What kind of rental arrangement do you prefer?",
    options: [
      "Wolse (Deposit + Monthly Rent)",
      "Jeonse (Deposit only)",
      "Purchase (Buying a house)",
      "Unsure",
    ],
  },
  {
    id: 6,
    text: "What housing type do you prefer?",
    options: ["One-room", "Two-room", "Officetel", "Shared house"],
  },
  {
    id: 7,
    text: "What’s your estimated monthly rent budget?",
    options: ["< $360", "$510", "$680", "$850", "$1020", "More than $1020"],
  },
  {
    id: 8,
    text: "What’s your estimated deposit budget?",
    options: [
      "< $3600",
      "$5100",
      "$6800",
      "$8500",
      "$10200",
      "More than $10200",
    ],
  },
  {
    id: 9,
    text: "What’s your estimated purchase budget?",
    options: [
      "< $36,000",
      "$51,000",
      "$68,000",
      "$85,000",
      "$102,000",
      "More than $102,000",
    ],
  },
  {
    id: 10,
    text: "What’s your preferred method of communication?",
    options: ["Email", "Phone Call", "Text Message", "In-person Meeting"],
  },
  {
    id: 11,
    text: "How many people will be living with you?",
    options: ["Just me", "2-3 people", "4-5 people"],
  },
  { id: 12, text: "Do you have any pets?", options: ["Yes", "No"] },
  {
    id: 13,
    text: "What amenities are most important to you?",
    options: ["Parking", "Laundry", "Gym", "Pool", "Pet-friendly"],
  },
  {
    id: 14,
    text: "How long do you plan to stay in the property?",
    options: ["Less than a year", "1-2 years", "More than 2 years"],
  },
  { id: 15, text: "Any additional comments or preferences?", options: [] },
  { id: 16, text: "What is your name?", options: [] },
];

const baseStyle = {
  padding: "0.75rem",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background 0.2s",
};

function App() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textInput, setTextInput] = useState("");
  const [done, setDone] = useState(false);

  const currentQ = questions[current];
  const isOpenEnded = currentQ?.options.length === 0;

  const handleAnswer = useCallback(
    (answer) => {
      if (isOpenEnded && !answer.trim()) return; // Skip empty submissions
      setAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));
      setTextInput("");
      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
      } else {
        setDone(true);
      }
    },
    [current, currentQ, isOpenEnded]
  );

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setTextInput("");
    setDone(false);
  };

  const sendToAirtable = useCallback(() => {
    const record = {
      fields: {
        Name: answers[16] || "",
        MoveInPlan: answers[2] || "",
        Pets: answers[12] || "",
        Language: answers[1] || "",
        FullData: JSON.stringify(answers),
      },
    };

    fetch("https://api.airtable.com/v0/appjOplqzGhygN7FZ/UserData", {
      method: "POST",
      headers: {
        Authorization: `Bearer YOUR_SECRET_KEY`, // Replace with env variable in production
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })
      .then((res) => res.json())
      .then((data) => console.log("Sent to Airtable:", data))
      .catch((err) => console.error("Airtable error:", err));
  }, [answers]);

  useEffect(() => {
    if (done) sendToAirtable();
  }, [done, sendToAirtable]);

  const renderQuestion = useMemo(() => {
    return (
      <>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          {currentQ.text}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {isOpenEnded ? (
            <>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Your answer"
                style={{
                  ...baseStyle,
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={() => handleAnswer(textInput)}
                style={{
                  ...baseStyle,
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                }}
              >
                Submit
              </button>
            </>
          ) : (
            currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                style={{
                  ...baseStyle,
                  border: "1px solid #007bff",
                  backgroundColor: "#fff",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e7f0ff")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#fff")
                }
              >
                {option}
              </button>
            ))
          )}
        </div>
      </>
    );
  }, [currentQ, textInput, handleAnswer, isOpenEnded]);

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "2rem",
          backgroundColor: "#fafafa",
        }}
      >
        {!done ? (
          renderQuestion
        ) : (
          <>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
              Your Preferences
            </h2>
            <ul style={{ paddingLeft: "1rem" }}>
              {questions.map((q) => (
                <li key={q.id} style={{ marginBottom: "0.5rem" }}>
                  <strong>{q.text}</strong>: {answers[q.id] || ""}
                </li>
              ))}
            </ul>
            <button
              onClick={restart}
              style={{
                ...baseStyle,
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                marginTop: "1.5rem",
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
