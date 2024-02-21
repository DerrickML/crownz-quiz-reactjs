// AnswerCard.js
import React, { useState } from 'react';
import { Card, ListGroup, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setUserAnswer, setSelectedOption } from '../../redux/actions';
import { isImageUrl } from './utils';

/**
 * Renders an answer card component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.resultsData - The data for rendering the answer card.
 * @returns {JSX.Element} The rendered answer card component.
 */
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

    // Define renderQuestionText function here
    const renderQuestionText = (data, questionText, questionImage, explanation, answer, user_answer, questionType, mark) => {

        const checkAnswer = (answer, user_answer, questionType, mark) => {
            // Helper function to normalize answers for comparison
            const normalize = value => typeof value === 'string' ? value.trim().toLowerCase() : value;

            // Normalize user_answer and answer
            user_answer = Array.isArray(user_answer) ? user_answer.map(normalize) : normalize(user_answer);
            answer = Array.isArray(answer) ? answer.map(normalize) : normalize(answer);

            let score = 0;
            let maxScore = 0;

            if (questionType === 'multipleChoice' || questionType === 'text') {
                maxScore = mark || 1; //Assign the max score to mark if available, otherwise 1
                // Single mark for multipleChoice and text, check if answer matches
                if (answer === user_answer || (Array.isArray(answer) && answer.includes(user_answer))) {
                    score = mark || 1; // Use provided mark or default to 1
                }
            } else if (questionType === 'check_box') {
                // Checkbox question type
                maxScore = mark || (Array.isArray(answer) ? answer.length : 1);
                if (Array.isArray(user_answer)) {
                    user_answer.forEach(val => {
                        if (answer.includes(val)) {
                            score++;
                        }
                    });
                    score = Math.min(score, maxScore); // Limit score to maxScore
                }
            }

            return { score, maxScore };
        };

        const isAnswerCorrect = checkAnswer(answer, user_answer, questionType, mark);
        const { score, maxScore } = checkAnswer(answer, user_answer, questionType, mark);

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

                            {
                                score === maxScore ?
                                    (
                                        <Badge pill bg="success">
                                            Correct
                                        </Badge>
                                    )
                                    :
                                    (
                                        score > 0 && score < maxScore ?
                                            (
                                                <Badge pill bg="warning">
                                                    Partial
                                                </Badge>
                                            )
                                            :
                                            (
                                                <Badge pill bg="danger">
                                                    Fail
                                                </Badge>
                                            )
                                    )
                            }
                        </ListGroup.Item>
                        {score !== 0 && (
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
                                <Card.Text>{score}/{maxScore}</Card.Text>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                )}
            </>
        );
    };

    const renderQuestion = (question) => {
        const questionType = question.type; // Get the question type
        const mark = question.mark; // Get the mark if available
        return (
            <>
                {renderQuestionText(question, question.question, question.image, question.explanation, question.answer, question.user_answer, questionType, mark)}
                {question.sub_questions && question.sub_questions.map((subQ, index) => (
                    <div key={index}>
                        {renderQuestionText(subQ, subQ.question, subQ.image, subQ.explanation, subQ.answer, subQ.user_answer, subQ.type, subQ.mark)}
                    </div>
                ))}
            </>
        );
    };

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

export default AnswerCard;