import React, { useState, useEffect } from 'react';
import { Card, ButtonGroup, Button, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import AnswerInput from './AnswerInput';
import { setUserAnswer, setSelectedOption } from './redux/actions';
import { isImageUrl } from './utils';

const QuestionCard = ({ questionIndex, question, isEitherOr, categoryId, setUserAnswer, setSelectedOption, answers }) => {
    const [selectedOption, setSelectedOptionState] = useState('');

    useEffect(() => {
        // Assign IDs to sub-questions if they don't already have one
        assignSubQuestionIds(question);
    }, [question]);

    const assignSubQuestionIds = (currentQuestion) => {
        if (currentQuestion.sub_questions) {
            currentQuestion.sub_questions.forEach((subQuestion, subIndex) => {
                if (!subQuestion.id) {
                    subQuestion.id = `${currentQuestion.id}_sub_${subIndex}`;
                }
            });
        }
    };

    // Helper function to convert index to roman numeral
    function indexToRoman(index) {
        const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"].map(numeral => `(${numeral})`);
        return roman[index];
    }

    const getUserAnswer = (questionId) => {
        const key = `${categoryId}-${questionId}`;
        return answers[key];
    };

    const handleAnswerChange = (questionId, answer, questionType, subQuestionIndex = null) => {
        let uniqueId = subQuestionIndex !== null ? `${questionId}_sub_${subQuestionIndex}` : questionId;
        setUserAnswer(uniqueId, answer, categoryId, isEitherOr, questionType);
        console.log(`Answer changed for ID: ${uniqueId}, Answer:`, answer);
    };

    const handleOptionSelection = (option) => {
        setSelectedOptionState(option);

        let id;
        if (isEitherOr) {
            id = option === 'either' ? question.either.id : question.or.id;
            setSelectedOption(`${id}-selectedOption`, option, categoryId, true);
        } else {
            id = question.id;
            setSelectedOption(`${id}-selectedOption`, option, categoryId, false);
        }
        console.log(`Option selected: ${option}, ID: ${id}`);
    };

    const renderQuestionText = (questionText, questionImage, questionType) => (
        <>
            <p>
                {questionType === 'dragAndDrop' ?
                    <>
                        {questionIndex + categoryId}. <span>{questionText.join(' ')}</span>
                    </>
                    :
                    <>
                        {questionIndex + categoryId}. <span dangerouslySetInnerHTML={{ __html: questionText }}></span>
                    </>
                }
            </p>
            {questionImage && isImageUrl(questionImage) && (
                <Card style={{ alignItems: 'flex-start', textAlign: 'center', margin: '10px 0' }}>
                    <Card.Img src={questionImage} alt="Question" style={{ maxWidth: '20rem', height: 'auto' }} />
                </Card>
            )}
        </>
    );

    const renderQuestion = (currentQuestion, disabled) => {
        return (
            <>
                {renderQuestionText(currentQuestion.question, currentQuestion.image, currentQuestion.type)}
                <AnswerInput
                    question={currentQuestion}
                    onChange={(answer) => handleAnswerChange(currentQuestion.id, answer, currentQuestion.type)}
                    getUserAnswer={getUserAnswer}
                    disabled={disabled}
                    displayQuestionText={false}
                />
                {currentQuestion.sub_questions && currentQuestion.sub_questions.map((subQ, index) => (
                    <AnswerInput
                        key={`${currentQuestion.id}_sub_${index}`}
                        question={subQ}
                        onChange={(answer) => handleAnswerChange(currentQuestion.id, answer, subQ.type, index)}
                        getUserAnswer={() => getUserAnswer(`${currentQuestion.id}_sub_${index}`)}
                        disabled={false}
                        displayQuestionText={true}
                        questionNumber={indexToRoman(index)}
                    />
                ))}
            </>
        );
    };

    return (
        <ListGroup>
            <ListGroup.Item>
                {isEitherOr ? (
                    <>
                        <ButtonGroup>
                            <Button variant={selectedOption === 'either' ? "success" : "secondary"} onClick={() => handleOptionSelection('either')}>Either</Button>
                            <Button variant={selectedOption === 'or' ? "warning" : "secondary"} onClick={() => handleOptionSelection('or')}>Or</Button>
                        </ButtonGroup>
                        {selectedOption === 'either' ? renderQuestion(question.either, selectedOption !== 'either') : renderQuestion(question.or, selectedOption !== 'or')}
                    </>
                ) : (
                    renderQuestion(question, false)
                )}
            </ListGroup.Item>
        </ListGroup>
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
