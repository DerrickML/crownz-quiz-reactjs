// AnswerCard.js
import React, { useState } from 'react';
import { Card, ListGroup, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setUserAnswer, setSelectedOption } from '../../redux/actions';
import { isImageUrl } from './utils';

const AnswerCard = ({ resultsData }) => {

    const renderValue = (value) => {
        if (Array.isArray(value)) {
            return (
                <ul>
                    {value.map((answer, index) => (
                        <li key={index}>{<Card.Text dangerouslySetInnerHTML={{ __html: answer }}></Card.Text>}</li>
                    ))}
                </ul>
            );
        } else if (isImageUrl(value)) {
            return (
                <Card>
                    <Card.Img variant="top" src={value} style={{ maxWidth: '20rem', maxHeight: '10rem', margin: 'auto' }} />
                </Card>
            );
        } else {
            return (
                <>
                    <Card.Text dangerouslySetInnerHTML={{ __html: value }}></Card.Text>
                </>
            );
        }
    };

    const areArraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();
        return sortedArr1.every((element, index) => element === sortedArr2[index]);
    };

    // Define renderQuestionText function here
    const renderQuestionText = (data, questionText, questionImage, explanation, answer, user_answer, mark) => {

        // const checkAnswer = (answer, user_answer) => {
        //     // Convert to lowercase
        //     if (typeof user_answer === 'string') {
        //         user_answer = user_answer.toLowerCase();
        //     } else if (Array.isArray(user_answer)) {
        //         user_answer = user_answer.map(answer => answer.toLowerCase());
        //     }

        //     if (typeof answer === 'string') {
        //         answer = answer.toLowerCase();
        //     } else if (Array.isArray(answer)) {
        //         answer = answer.map(answer => answer.toLowerCase());
        //     }

        //     // Check for equality
        //     if (Array.isArray(answer) && Array.isArray(user_answer)) {
        //         if (user_answer.length > answer.length) {
        //             return false;
        //         } else {
        //             return user_answer.every(val => answer.includes(val));
        //         }
        //     } else if (Array.isArray(answer) && typeof user_answer === 'string') {
        //         return answer.includes(user_answer);
        //     } else if (typeof answer === 'string' && typeof user_answer === 'string') {
        //         return answer === user_answer;
        //     }

        //     return false;
        // };

        const checkAnswer = (answer, user_answer, mark) => {
            // Convert to lowercase
            if (typeof user_answer === 'string') {
                user_answer = user_answer.toLowerCase();
            } else if (Array.isArray(user_answer)) {
                user_answer = user_answer.map(answer => answer.toLowerCase());
            }

            if (typeof answer === 'string') {
                answer = answer.toLowerCase();
            } else if (Array.isArray(answer)) {
                answer = answer.map(answer => answer.toLowerCase());
            }

            // Check for equality
            let score = 0;
            if (Array.isArray(answer) && Array.isArray(user_answer)) {
                if (user_answer.length > answer.length) {
                    return 0;
                } else {
                    user_answer.forEach(val => {
                        if (answer.includes(val)) {
                            score++;
                        }
                    });
                }
            } else if (Array.isArray(answer) && typeof user_answer === 'string') {
                if (answer.includes(user_answer)) {
                    score = 1;
                }
            } else if (typeof answer === 'string' && typeof user_answer === 'string') {
                if (answer === user_answer) {
                    score = 1;
                }
            }

            // If mark is defined, limit the score to the mark value
            if (mark !== undefined) {
                score = Math.min(score, mark);
            }

            return score;
        };

        const isAnswerCorrect = checkAnswer(answer, user_answer);
        const score = checkAnswer(answer, user_answer, mark);

        return (
            <>
                <Card.Header dangerouslySetInnerHTML={{ __html: questionText }}></Card.Header>
                {questionImage && isImageUrl(questionImage) && (
                    <Card.Img src={questionImage} alt="Question" style={{ maxWidth: '25rem', maxHeight: '15rem' }} />
                )}

                {data.hasOwnProperty("answer") && (
                    <ListGroup>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">Your Answer</div>
                                {user_answer ? renderValue(user_answer) : "Not Answered"}
                            </div>

                            {isAnswerCorrect ? (
                                <Badge pill bg="success">
                                    Correct
                                </Badge>
                            ) : (
                                <Badge pill bg="danger">
                                    Fail
                                </Badge>
                            )}
                        </ListGroup.Item>
                        {!isAnswerCorrect && (
                            <>
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">Correct Answer</div>
                                        {renderValue(answer)}
                                    </div>
                                </ListGroup.Item>
                                {explanation && (
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                            <Card.Text className="fw-bold">Explanation</Card.Text>
                                            <Card.Text
                                                dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br/>') }}
                                            ></Card.Text>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </>
                        )}
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                                <Card.Text className="fw-bold">Score</Card.Text>
                                <Card.Text>{score}</Card.Text>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                )}
            </>
        );
    };

    const renderQuestion = (question) => (
        <>
            {renderQuestionText(question, question.question, question.image, question.explanation, question.answer, question.user_answer)}
            {/* other parts go here */}
            {question.sub_questions && question.sub_questions.map((subQ, index) => (

                // rendering subQ qtns
                renderQuestionText(subQ, subQ.question, subQ.image, subQ.explanation, subQ.answer, subQ.user_answer)

            ))}
        </>
    );

    return (
        <Card>
            <Card.Body>
                {
                    renderQuestion(resultsData, false)// Here, 'either' is used to handle non-either/or questions
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(AnswerCard);