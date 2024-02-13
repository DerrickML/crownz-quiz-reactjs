// SaveButton.js
import React from 'react';
import { useSelector } from 'react-redux';

const SaveButton = ({ selectedQuestions }) => {
    const reduxState = useSelector(state => state.answers);

    console.log("Redux ans passed to button\n", reduxState)

    const formatAnswersForSaving = () => {
        const formattedData = selectedQuestions.map(category => ({
            category: category.category,
            instruction: category.instructions || null,
            questions: category.questions.map(question => {

                // Handle either/or structure
                if (question.either && question.or) {
                    const selectedOption = reduxState[`${category.category}-${question.id}-selectedOption`] || 'either';
                    const relevantQuestion = question[selectedOption];

                    const questionKey = `${category.category}-${relevantQuestion.id}`;
                    const userAnswer = reduxState[questionKey] || null;

                    const formattedQuestion = {
                        ...relevantQuestion,
                        user_answer: userAnswer,
                        selectedOption: selectedOption,
                    };

                    if (relevantQuestion.sub_questions) {
                        formattedQuestion.sub_questions = relevantQuestion.sub_questions.map(subQ => {
                            const subQuestionKey = `${category.category}-${subQ.id}`;
                            const subUserAnswer = reduxState[subQuestionKey] || null;

                            return {
                                ...subQ,
                                user_answer: subUserAnswer,
                            };
                        });
                    }

                    return formattedQuestion;
                }

                // Handle normal questions and sub-questions
                const questionKey = `${category.category}-${question.id}`;
                const userAnswer = reduxState[questionKey] || null;

                const formattedQuestion = {
                    ...question,
                    user_answer: userAnswer,
                };

                if (question.sub_questions) {
                    formattedQuestion.sub_questions = question.sub_questions.map(subQ => {
                        const subQuestionKey = `${category.category}-${subQ.id}`;
                        const subUserAnswer = reduxState[subQuestionKey] || null;

                        return {
                            ...subQ,
                            user_answer: subUserAnswer,
                        };
                    });
                }

                return formattedQuestion;
            }),
        }));

        return formattedData;
    };

    const handleSave = () => {
        const finalDataToSave = formatAnswersForSaving();
        console.log(finalDataToSave);
        // Implement the save to backend or other logic here
    };

    return (
        <button onClick={handleSave}>Save Answers</button>
    );
};

export default SaveButton;
