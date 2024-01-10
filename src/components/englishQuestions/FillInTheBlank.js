import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useQuiz } from "../../context/QuizContext";

const FillInTheBlank = ({ data }) => {
  const { updateUserAnswer } = useQuiz();
  const [answers, setAnswers] = useState({});

  const handleInputChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
    updateUserAnswer(questionId, value);
  };

  const renderQuestionParts = (question, idx) => {
    const parts = question.split(/<input type='text'[^>]*>/);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={`part-${idx}-${index}`}>
            {part}
            {index < parts.length - 1 && (
              <Form.Control
                type="text"
                value={answers[`question-${idx}-${index}`] || ""}
                onChange={(e) =>
                  handleInputChange(`question-${idx}-${index}`, e.target.value)
                }
                className="d-inline-block mx-1" // Bootstrap classes for inline display
                size="sm" // Small size input
                style={{ width: "auto", maxWidth: "200px" }} // Adjust width as needed
              />
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div>
      <h4>{data.instructions}</h4>
      {data.questions.map((item, idx) => (
        <div key={idx} className="mb-3">
          <span
            style={{ fontWeight: "bold", marginRight: "10px" }}
          >{`Question ${idx + 1}:`}</span>
          <div className="flex-grow-1 d-flex align-items-center">
            {renderQuestionParts(item.question, idx)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FillInTheBlank;
