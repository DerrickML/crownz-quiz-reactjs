import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "./iframes.css";
import { useLocation, useNavigate } from "react-router-dom";

const QuizResults = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let results = location.state?.results;
  if (typeof results === "string") {
    results = JSON.parse(results);
  }

  useEffect(() => {
    if (!results) {
      setShowModal(true);
    }
  }, [results]);

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (!results) {
    // Handle the case where results are not passed
    return (
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>No Data Available</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Unfortunately, the quiz results data is not available. Please try
          accessing the quiz again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  let numbering = 1;

  const createMarkup = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    doc.querySelectorAll("input").forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
    return { __html: doc.body.innerHTML };
  };

  const renderQuizQuestions = (categoryResult) => (
    <div key={categoryResult.category} className="mb-4">
      <h4 className="mb-3">{categoryResult.instruction}</h4>
      {categoryResult.questions.map((questionResult, qIndex) => (
        <div key={qIndex} className="card mb-2">
          <div className="card-body">
            <h6 className="card-subtitle mb-2">
              Question {numbering++}:{" "}
              <span
                dangerouslySetInnerHTML={createMarkup(questionResult.question)}
              />
            </h6>
            <p
              className={`mb-1 ${
                questionResult.userAnswer.toLowerCase() ===
                questionResult.correctAnswer.toLowerCase()
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              Your answer: {questionResult.userAnswer}
            </p>
            {questionResult.userAnswer.toLowerCase() !==
              questionResult.correctAnswer.toLowerCase() && (
              <p className="text-success mb-1">
                Correct answer: {questionResult.correctAnswer}
              </p>
            )}
            <p className="mb-0">
              Marks:{" "}
              <span
                className={`badge ${
                  questionResult.marks > 0 ? "bg-success" : "bg-danger"
                }`}
              >
                {questionResult.marks}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderIframeResults = (iframeResult) =>
    iframeResult.data
      .flatMap((storyArr) => storyArr)
      .map((item, index) => (
        <div key={index} className="mb-4">
          <div className="card mb-2">
            <div
              className="card-body"
              dangerouslySetInnerHTML={createMarkup(item.story)}
            />
          </div>
        </div>
      ));

  const finalMarks = results.find((result) => result.type === "finalMarks") || {
    totalMarks: 0,
    marksObtained: 0,
  };
  const iframeResults = results.find(
    (result) => result.type === "iframeResults"
  ) || { data: [] };

  const totalMarks = 100;
  const marksObtained = finalMarks.marksObtained;
  const percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;

  return (
    <div className="container my-4">
      <div className="card text-center mb-4">
        <div className="card-header">Exam Results</div>
        <div className="card-body">
          <h5 className="card-title">
            Score: {marksObtained}/{totalMarks}
          </h5>
          <p className="card-text">Percentage: {percentage.toFixed(2)}%</p>
        </div>
      </div>

      {results
        .filter(
          (result) =>
            result.type !== "iframeResults" && result.type !== "finalMarks"
        )
        .map((categoryResult) => renderQuizQuestions(categoryResult))}

      {renderIframeResults(iframeResults)}
    </div>
  );
};

export default QuizResults;
