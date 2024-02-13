// QuestionCard.js
import React, { useState } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import AnswerInput from './AnswerInput';
import { setUserAnswer, setSelectedOption } from '../../redux/actions';
import { isImageUrl } from './utils';

const QuestionCard = ({ selectedQuestions, setUserAnswer, setSelectedOption, answers }) => {

    const [selectedOption, setSelectedOptionState] = useState('either');

    const isEitherOr = selectedQuestions.hasOwnProperty('either') && selectedQuestions.hasOwnProperty('or');

    // Fetch userAnswer from Redux state
    const getUserAnswer = (questionId) => {
        const key = `${selectedQuestions.categoryId}-${questionId}`;
        return answers[key];
    };

    // Call this function when the answer changes
    const handleAnswerChange = (questionId, answer, subQuestionIndex = null, isEitherOrType = null) => {

        //Ensure that the sub-questions have ids
        let uniqueId = subQuestionIndex !== null ? `${questionId}_sub_${subQuestionIndex}` : questionId;

        if (subQuestionIndex !== null) {
            // If it's a sub-question, append the sub-question index
            uniqueId = `${questionId}_sub_${subQuestionIndex}`;
        } else {
            // For regular questions, use the question ID directly
            uniqueId = questionId;
        }

        if (isEitherOrType) {
            // For 'either/or' questions, append the type ('either' or 'or') to the ID
            uniqueId = `${uniqueId}_${isEitherOrType}`;
        }

        setUserAnswer(uniqueId, answer, selectedQuestions.categoryId);
    };

    // Update Redux state when either/or selection changes
    const handleOptionSelection = (option) => {
        setSelectedOptionState(option);
        setSelectedOption(`${selectedQuestions.id}-selectedOption`, option, selectedQuestions.categoryId);
    };

    // Define renderQuestionText function here
    const renderQuestionText = (questionText, questionImage) => (
        <>
            <p dangerouslySetInnerHTML={{ __html: questionText }}></p>
            {questionImage && isImageUrl(questionImage) && (
                <Card style={{ alignItems: 'flex-start', textAlign: 'center', margin: '10px 0' }}>
                    <Card.Img src={questionImage} alt="Question" style={{ maxWidth: '20rem', height: 'auto' }} />
                </Card>
            )}
        </>
    );

    const renderQuestion = (question, disabled) => (
        <>
            {renderQuestionText(question.question_text, question.image)}
            <AnswerInput
                question={question}
                onChange={(answer) => handleAnswerChange(question.id, answer)}
                getUserAnswer={getUserAnswer}
                disabled={disabled}
                displayQuestionText={false}
            />
            {question.sub_questions && question.sub_questions.map((subQ, index) => (
                <AnswerInput
                    key={`${question.id}_sub_${index}`}
                    question={subQ}
                    onChange={(answer) => handleAnswerChange(question.id, answer, index, selectedOption)}
                    getUserAnswer={() => getUserAnswer(`${question.id}_sub_${index}`)}
                    disabled={false}
                    displayQuestionText={true}
                />
            ))}
        </>
    );

    return (
        <Card>
            <Card.Body>
                {isEitherOr ? (
                    <>
                        <ButtonGroup>
                            <Button
                                variant={selectedOption === 'either' ? "success" : "secondary"}
                                // onClick={() => setSelectedOption('either')}
                                onClick={() => handleOptionSelection('either')}
                            >
                                Either
                            </Button>
                            <Button
                                variant={selectedOption === 'or' ? "warning" : "secondary"}
                                // onClick={() => setSelectedOption('or')}
                                onClick={() => handleOptionSelection('or')}
                            >
                                Or
                            </Button>
                        </ButtonGroup>

                        {selectedOption === 'either' ? renderQuestion(selectedQuestions.either, selectedOption !== 'either') : renderQuestion(selectedQuestions.or, selectedOption !== 'or')}
                    </>
                ) : (
                    renderQuestion(selectedQuestions.either, false) // Here, 'either' is used to handle non-either/or questions
                )}
            </Card.Body>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    answers: state.answers
});

const mapDispatchToProps = {
    setUserAnswer,
    setSelectedOption
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCard);