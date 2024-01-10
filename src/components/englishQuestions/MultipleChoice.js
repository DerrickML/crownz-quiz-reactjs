import React, { useState, useEffect } from "react";
import { useQuiz } from "../../context/QuizContext";
import { Card, Form, ListGroup } from "react-bootstrap";

const MultipleChoice = ({ data }) => {
  const { userAnswers, updateUserAnswer } = useQuiz();
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    // Initialize selected options with userAnswers if they exist
    const initialSelections = data.questions.reduce((acc, item, idx) => {
      acc[`question-${idx}`] = userAnswers[`question-${idx}`] || "";
      return acc;
    }, {});
    setSelectedOptions(initialSelections);
  }, [data.questions, userAnswers]);

  const handleChange = (questionIndex, option) => {
    const questionId = `question-${questionIndex}`;
    updateUserAnswer(questionId, option);
    setSelectedOptions({ ...selectedOptions, [questionId]: option });
  };

  return (
    <>
      <h4>{data.instructions}</h4>
      {data.questions.map((item, idx) => {
        const questionId = `question-${idx}`;
        return (
          <Card key={idx} className="mb-3">
            <Card.Body>
              {/* <Card.Title>{`Question ${idx + 1}`}</Card.Title> */}
              <Card.Subtitle>{item.question}</Card.Subtitle>
              <ListGroup variant="flush">
                {item.options.map((option, optionIndex) => (
                  <ListGroup.Item key={optionIndex}>
                    <Form.Check
                      type="radio"
                      label={option}
                      name={questionId}
                      checked={selectedOptions[questionId] === option}
                      onChange={() => handleChange(idx, option)}
                      id={`${questionId}-option-${optionIndex}`}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default MultipleChoice;
