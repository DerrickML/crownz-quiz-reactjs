import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import questions_answers from "../otherFiles/questions"; // Make sure the path is correct
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Questions = ({ questions, onDrop, userAnswers, results }) => {
  // Function to convert index to letter (A, B, C, ...)
  const indexToLetter = (index) => String.fromCharCode(65 + index);

  return (
    <Container>
      {questions.map((question, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Title>Question {index + 1}</Card.Title>
            <Card.Text>{question.question}</Card.Text>
            <DropZone
              questionId={index}
              onDrop={(option) => onDrop(index, option)}
              userAnswer={userAnswers[index]}
              result={results ? results[index] : null}
            />
            <div className="mt-3">
              {question.answers.options.map((option, idx) => (
                <DraggableAnswer
                  key={idx}
                  questionId={index}
                  text={`(${indexToLetter(idx)}) ${option}`}
                  originalText={option} // Original text without prefix
                />
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

const DropZone = ({ questionId, onDrop, userAnswer, result }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "answer",
    drop: (item, monitor) => {
      if (item.questionId === questionId) {
        onDrop(item.id);
      }
    },
    canDrop: (item, monitor) => item.questionId === questionId, // Check question ID
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && monitor.canDrop(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  let backgroundColor = "white";
  if (result) {
    backgroundColor = result.isCorrect ? "lightgreen" : "pink";
  } else if (canDrop) {
    backgroundColor = "lightblue";
  }

  return (
    <div
      ref={drop}
      style={{ backgroundColor, minHeight: "50px", padding: "10px" }}
    >
      {result ? (
        <p style={{ color: result.isCorrect ? "green" : "red" }}>
          {userAnswer}
          {!result.isCorrect && ` (Correct: ${result.correctAnswer})`}
        </p>
      ) : (
        <p>{userAnswer || "Drop answer here"}</p>
      )}
    </div>
  );
};

const DraggableAnswer = ({ questionId, text, originalText }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "answer",
    item: { id: originalText, questionId }, // Pass original text for comparison
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {text} {/* Display prefixed text */}
    </div>
  );
};

function Testing() {
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleDrop = (questionId, answerText) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerText,
    }));
  };

  const handleSubmit = () => {
    const evaluatedResults = questions_answers.map((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.answers.correct_answer;
      return {
        isCorrect: userAnswer === correctAnswer,
        correctAnswer,
        userAnswer,
      };
    });
    setResults(evaluatedResults);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <Questions
          questions={questions_answers}
          onDrop={handleDrop}
          userAnswers={userAnswers}
          results={results}
        />
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
        {results && (
          <div>
            <p>Correct Answers: {results.filter((r) => r.isCorrect).length}</p>
            <p>
              Incorrect Answers: {results.filter((r) => !r.isCorrect).length}
            </p>
          </div>
        )}
      </Container>
    </DndProvider>
  );
}

export default Testing;
