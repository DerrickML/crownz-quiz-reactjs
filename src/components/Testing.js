import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { QuizProvider, useQuiz } from "../context/QuizContext";
import FillInTheBlank from "./englishQuestions/FillInTheBlank";
import AlphabeticalOrdering from "./englishQuestions/AlphabeticalOrdering";
import MultipleChoice from "./englishQuestions/MultipleChoice";
import questionsData from "../otherFiles/english.json";

const Testing = () => {
  const {
    userAnswers,
    currentSectionIndex,
    goToNextSection,
    resetQuiz,
    currentCategory,
    setCurrentCategory,
  } = useQuiz();
  console.log(userAnswers, currentSectionIndex);

  useEffect(() => {
    if (questionsData && questionsData[0] && questionsData[0]["Section A"]) {
      setCurrentCategory(
        questionsData[0]["Section A"][currentSectionIndex].category
      );
    }
  }, [currentSectionIndex, setCurrentCategory]);

  if (
    !questionsData ||
    !Array.isArray(questionsData) ||
    !questionsData[0] ||
    !Array.isArray(questionsData[0]["Section A"]) ||
    currentSectionIndex >= questionsData[0]["Section A"].length
  ) {
    return <div>No more sections or data is not loaded correctly.</div>;
  }

  const sectionData = questionsData[0]["Section A"];

  console.log(sectionData);

  const renderSectionByCategory = () => {
    const sectionData = questionsData[0]["Section A"].find(
      (section) => section.category === currentCategory
    );

    if (!sectionData) {
      return <div>Loading...</div>;
    }

    switch (currentCategory) {
      case "fillBlank":
        return <FillInTheBlank data={sectionData} />;
      case "alphabetical":
        return <AlphabeticalOrdering data={sectionData} />;
      case "multiple_choice":
        return <MultipleChoice data={sectionData} />;
      // Add other cases here as needed
      default:
        return <div>Invalid category or data is missing.</div>;
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          {currentSectionIndex < questionsData[0]["Section A"].length ? (
            <>
              {renderSectionByCategory()}
              <Button onClick={goToNextSection}>Next Section</Button>
            </>
          ) : (
            <>
              <div>The quiz is completed!</div>
              <Button onClick={resetQuiz}>Start Over</Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

const TestingWithProvider = () => (
  <QuizProvider>
    <Testing />
  </QuizProvider>
);

export default TestingWithProvider;
