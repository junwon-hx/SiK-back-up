import React, { useState, useEffect } from "react";

const questions = [
  { id: 1, text: "Please choose your preferred language", options: ["English", "Korean", "Spanish", "Mandarin"] },
  { id: 2, text: "When do you plan to move in?", options: ["Within a month", "1-3 months", "3-6 months", "More than 6 months", "Not sure"] },
  { id: 3, text: "Do you have a preferred location?", options: ["Yes", "No"] },
  { id: 4, text: "What are your biggest concerns?", options: ["Price", "Neighborhood Safety", "Scams", "Communication issues", "Condition of the property"] },
  { id: 5, text: "What kind of rental arrangement do you prefer?", options: ["Wolse (Deposit + Monthly Rent)", "Jeonse (Deposit only)", "Purchase (Buying a house)", "Unsure"] },
  { id: 6, text: "What housing type do you prefer?", options: ["One-room", "Two-room", "Officetel", "Shared house"] },
  { id: 7, text: "What’s your estimated monthly rent budget?", options: ["< $360", "$510", "$680", "$850", "$1020", "More than $1020"] },
  { id: 8, text: "What’s your estimated deposit budget?", options: ["< $3600", "$5100", "$6800", "$8500", "$10200", "More than $10200"] },
  { id: 9, text: "What’s your estimated purchase budget?", options: ["< $36,000", "$51,000", "$68,000", "$85,000", "$102,000", "More than $102,000"] },
  { id: 10, text: "What’s your preferred method of communication?", options: ["Email", "Phone Call", "Text Message", "In-person Meeting"] },
  { id: 11, text: "How many people will be living with you?", options: ["Just me", "2-3 people", "4-5 people"] },
  { id: 12, text: "Do you have any pets?", options: ["Yes", "No"] },
  { id: 13, text: "What amenities are most important to you?", options: ["Parking", "Laundry", "Gym", "Pool", "Pet-friendly"] },
  { id: 14, text: "How long do you plan to stay in the property?", options: ["Less than a year", "1-2 years", "More than 2 years"] },
  { id: 15, text: "Any additional comments or preferences?", options: [] },
  { id: 16, text: "What is your name?", options: [] },
];

function App() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [textInput, setTextInput] = useState("");

  const currentQ = questions[current];
  const isOpenEnded = currentQ?.options?.length === 0;

  const baseBtn = {
    padding: "0.75rem",
    borderRadius: "5px",
    border: "1px solid #007bff",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const handleAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
    setTextInput("");
    setCurrent((prev) => prev + 1);
    if (current + 1 === questions.length) setDone(true);
  };

  const restart = () => {
    setAnswers({});
    setCurrent(0);
    setDone(false);
  };

  const sendToAirtable = () => {
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
        Authorization: "Bearer pat04vfX2LDqLwwTy.b042e8c08345689f824e94562592833bc321ca1cde0187558aa318607b7315ba",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Sent to Airtable:", data))
      .catch((err) => console.error("❌ Airtable error:", err));
  };

  useEffect(() => {
    if (done) sendToAirtable();
  }, [done]);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "2rem", backgroundColor: "#fafafa" }}>
        {!done ? (
          <>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{currentQ.text}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {isOpenEnded ? (
                <>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Your answer"
                    style={{ ...baseBtn, border: "1px solid #ccc", marginBottom: "1rem" }}
                  />
                  <button
                    onClick={() => handleAnswer(textInput)}
                    style={{ ...baseBtn, backgroundColor: "#007bff", color: "white" }}
                  >
                    Submit
                  </button>
                </>
              ) : (
                currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    style={baseBtn}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#e7f0ff")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Your Preferences</h2>
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
