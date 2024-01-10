import React, { useState } from "react";
import questionsData from "../otherFiles/questions";
import DeferredDroppable from "./DeferredDroppable"; // Assuming DeferredDroppable is in the same directory
import "./Testing.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Card,
  Badge,
} from "react-bootstrap";

/*OBJECTIVES QUESTIONS*/
function ObjectiveQuestion({
  question,
  handleOptionChange,
  userAnswers,
  submitted,
}) {
  const selectedOption = userAnswers[question.question];
  const isCorrect = selectedOption === question.answers.correct_answer;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">{question.question}</Card.Title>
        <Form.Group>
          {question.answers.options.map((option, index) => {
            const isSelected = option === selectedOption;
            return (
              <Form.Check
                key={index}
                type="radio"
                id={`radio-${index}`}
                name={question.question}
                label={option}
                value={option}
                checked={isSelected}
                onChange={(e) =>
                  handleOptionChange(question.question, e.target.value)
                }
                custom
              />
            );
          })}
        </Form.Group>
        {submitted && !isCorrect && (
          <Alert variant="warning" className="mt-3">
            Correct Answer: {question.answers.correct_answer}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

/*SENTENCE CONSTRUCTION*/
// Reorder function
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/*TEST COMPONENT*/
function Testing() {
  // Prepare initial sentences data from the JSON file
  const prepareSentenceData = () => {
    return questionsData.sections
      .find((section) => section.section === "reconstruct sentence")
      .questions.map((question, index) => ({
        id: `sentence-${index + 1}`,
        words: question.question,
        correctOrder: question.correct_answer,
        userOrder: [],
      }));
  };

  // State for sentence construction
  const [sentences, setSentences] = useState(prepareSentenceData());

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const [sentencePrefix, sentenceIndex, wordIndex] =
      result.draggableId.split("-");
    const sentenceId = `${sentencePrefix}-${sentenceIndex}`;
    const sentence = sentences.find((s) => s.id === sentenceId);

    const words = reorder(
      sentence.words,
      result.source.index,
      result.destination.index
    );

    setSentences(
      sentences.map((s) => {
        if (s.id === sentence.id) {
          return { ...s, words };
        }
        return s;
      })
    );
  };

  const checkOrder = (sentence) => {
    return (
      JSON.stringify(sentence.words) === JSON.stringify(sentence.correctOrder)
    );
  };

  /**
   * ********************************
   */
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (question, option) => {
    setUserAnswers({ ...userAnswers, [question]: option });
  };

  // Combined submission for both objective and sentence construction
  const handleSubmit = () => {
    // Update user order for sentence construction
    const updatedSentences = sentences.map((sentence) => ({
      ...sentence,
      userOrder: [...sentence.words],
    }));
    setSentences(updatedSentences);

    // Set submitted to true to show results
    setSubmitted(true);
  };

  // Calculate total score including sentence construction
  const calculateScore = () => {
    // Score for objective questions
    let score = questionsData.sections[0].questions.reduce((acc, question) => {
      return (
        acc +
        (userAnswers[question.question] === question.answers.correct_answer
          ? 1
          : 0)
      );
    }, 0);

    // Score for sentence construction
    score += sentences.reduce((acc, sentence) => {
      return (
        acc +
        (JSON.stringify(sentence.words) ===
        JSON.stringify(sentence.correctOrder)
          ? 1
          : 0)
      );
    }, 0);

    return score;
  };

  // Total number of questions (objectives + sentences)
  const totalQuestions =
    questionsData.sections[0].questions.length + sentences.length;

  return (
    <Container className="my-4">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          {/* Render Objective Questions */}
          {questionsData.sections[0].questions.map((q, index) => (
            <ObjectiveQuestion
              key={index}
              question={q}
              handleOptionChange={handleOptionChange}
              userAnswers={userAnswers}
              submitted={submitted}
            />
          ))}

          {/* Sentence Construction */}
          <DragDropContext onDragEnd={onDragEnd}>
            {sentences.map((sentence, index) => (
              <DeferredDroppable
                droppableId={sentence.id}
                key={sentence.id}
                direction="horizontal"
              >
                {(provided) => (
                  <Card className="mb-4 shadow-sm">
                    <Card.Body>
                      <Card.Title>Sentence {index + 1}</Card.Title>
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="d-flex align-items-center justify-content-center"
                      >
                        {sentence.words.map((word, idx) => (
                          <Draggable
                            key={`${sentence.id}-word-${idx}`}
                            draggableId={`${sentence.id}-word-${idx}`}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <Badge
                                pill
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                variant={
                                  snapshot.isDragging ? "success" : "secondary"
                                }
                                className="px-3 py-2 m-1 draggable-badge"
                              >
                                {word}
                              </Badge>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      {sentence.userOrder.length > 0 && (
                        <Alert
                          variant={checkOrder(sentence) ? "success" : "danger"}
                          className="mt-3"
                        >
                          {checkOrder(sentence) ? "Correct!" : "Incorrect"}
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                )}
              </DeferredDroppable>
            ))}
          </DragDropContext>

          {/* Common Submit Button */}
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              className="submit-button"
            >
              Submit
            </Button>
          </div>

          {/* Display Results */}
          {submitted && (
            <Alert variant="info" className="mt-4 text-center">
              Your Total Score: {calculateScore()}/{totalQuestions}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Testing;
