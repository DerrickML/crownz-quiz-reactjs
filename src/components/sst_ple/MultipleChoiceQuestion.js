// MultipleChoiceQuestion.js
import React from 'react';
import { Form, Card } from 'react-bootstrap';
import { isImageUrl } from './utils';

const MultipleChoiceQuestion = ({ question, onChange, disabled, userAnswer, displayQuestionText }) => {
    const options = question.options || [];

    return (
        <Form.Group>
            {displayQuestionText && <Form.Label dangerouslySetInnerHTML={{ __html: question.question_text }} />}

            {/* {question.image && isImageUrl(question.image) && (
                <Card style={{ alignContent: 'center' }}>
                    <img src={question.image} alt="Question" style={{ maxWidth: '10rem', height: 'auto' }} />
                </Card>
            )} */}
            {options.map((option, index) => (
                <Form.Check
                    type="radio"
                    label={isImageUrl(option) ? <img src={option} alt="Option" style={{ width: '6rem', height: 'auto' }} /> : <span dangerouslySetInnerHTML={{ __html: option }}></span>}
                    name={question.id}
                    id={`${question.id}-${index}`}
                    onChange={onChange}
                    disabled={disabled}
                    key={`${question.id}-${index}`}
                />
            ))}
        </Form.Group>
    );
};

export default MultipleChoiceQuestion;