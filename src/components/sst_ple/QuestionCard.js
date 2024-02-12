// QuestionCard.js
import React, { useState, useContext } from 'react';
import QuizContext from './QuizContext';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import AnswerInput from './AnswerInput';
import { isImageUrl } from './utils';

const QuestionCard = ({ questionData }) => {
    const { setUserAnswer } = useContext(QuizContext);
    const [selectedOption, setSelectedOption] = useState('either');
    const isEitherOr = questionData.hasOwnProperty('either') && questionData.hasOwnProperty('or');

    // Define renderQuestionText function here
    const renderQuestionText = (questionText, questionImage) => (
        <>
            <p dangerouslySetInnerHTML={{ __html: questionText }}></p>
            {questionImage && isImageUrl(questionImage) && (
                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                    <img src={questionImage} alt="Question" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            )}
        </>
    );

    const renderQuestion = (question, disabled) => (
        <>
            {renderQuestionText(question.question_text, question.image)}
            <AnswerInput
                question={question}
                disabled={disabled}
                displayQuestionText={false} // Don't display the question text here, it's already rendered above
            />
            {question.sub_questions && question.sub_questions.map((subQ, index) => (
                <AnswerInput
                    key={`${question.id}_sub_${index}`}
                    question={subQ}
                    disabled={false}
                    displayQuestionText={true} // Display the question text for sub-questions
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
                                onClick={() => setSelectedOption('either')}
                            >
                                Either
                            </Button>
                            <Button
                                variant={selectedOption === 'or' ? "warning" : "secondary"}
                                onClick={() => setSelectedOption('or')}
                            >
                                Or
                            </Button>
                        </ButtonGroup>

                        {selectedOption === 'either' ? renderQuestion(questionData.either, selectedOption !== 'either') : renderQuestion(questionData.or, selectedOption !== 'or')}
                    </>
                ) : (
                    renderQuestion(questionData.either, false) // Here, 'either' is used to handle non-either/or questions
                )}
            </Card.Body>
        </Card>
    );
};

export default QuestionCard;
