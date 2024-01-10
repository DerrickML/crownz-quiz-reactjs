import React, { createContext, useState } from "react";
import questionsData from "../otherFiles/english.json";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);

  const resetQuiz = () => {
    setUserAnswers({});
    setCurrentSectionIndex(0);
  };

  const updateUserAnswer = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const goToNextSection = () => {
    setCurrentSectionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex < questionsData[0]["Section A"].length) {
        setCurrentCategory(questionsData[0]["Section A"][newIndex].category);
      } else {
        setCurrentCategory(null);
      }
      return newIndex;
    });
  };

  return (
    <QuizContext.Provider
      value={{
        userAnswers,
        updateUserAnswer,
        currentSectionIndex,
        goToNextSection,
        resetQuiz,
        currentCategory,
        setCurrentCategory,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => React.useContext(QuizContext);
