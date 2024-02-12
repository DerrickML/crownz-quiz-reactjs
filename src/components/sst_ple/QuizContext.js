// QuizContext.js
import React, { createContext, useState, useCallback } from 'react';

const QuizContext = createContext({
    userAnswers: {},
    setUserAnswer: () => { },
});

export const QuizProvider = ({ children }) => {
    const [userAnswers, setUserAnswers] = useState({});

    const setUserAnswer = useCallback((questionId, answer, categoryId, isSubQuestion = false, parentQuestionId = null) => {
        setUserAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            if (isSubQuestion && parentQuestionId) {
                if (!newAnswers[parentQuestionId]) {
                    newAnswers[parentQuestionId] = { subQuestions: {} };
                }
                newAnswers[parentQuestionId].subQuestions[questionId] = answer;
            } else {
                newAnswers[questionId] = { answer, categoryId };
            }
            return newAnswers;
        });
    }, []);

    return (
        <QuizContext.Provider value={{ userAnswers, setUserAnswer }}>
            {children}
        </QuizContext.Provider>
    );
};

export default QuizContext;
