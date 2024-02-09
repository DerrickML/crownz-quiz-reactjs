// QuestionCard.js
import React, { useState } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import AnswerInput from './AnswerInput';
import { isImageUrl } from './utils'; // Import utility function

const QuestionCard = ({ questionData }) => {
    const [selectedOption, setSelectedOption] = useState('either');
    const isEitherOr = questionData.hasOwnProperty('either') && questionData.hasOwnProperty('or');

    const renderQuestion = (question, disabled) => (
        <>

            {
                /* For categories 41 and above */
                questionData.categoryId > 40 ? (
                    question.image && isImageUrl(question.image) && (
                        <>
                            {question.question_text}

                            <div style={{ textAlign: 'center', margin: '10px 0' }}>
                                <Card><img src={question.image} alt="Question" style={{ width: '30rem', hight: 'auto' }} /></Card>
                            </div>
                        </>
                    )
                ) : null
            }

            <AnswerInput question={question} disabled={disabled} />
            {question.sub_questions && question.sub_questions.map((subQ, index) => (
                <AnswerInput key={`${question.id}_sub_${index}`} question={subQ} disabled={false} />
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
                    renderQuestion(questionData.either, false)
                )}
            </Card.Body>
        </Card>
    );
};

export default QuestionCard;
