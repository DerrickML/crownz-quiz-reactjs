// CheckboxQuestion.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { isImageUrl } from './utils';

const CheckboxQuestion = ({ question, onChange, disabled }) => {
    const options = question.options || [];

    return (
        <Form.Group>
            <Form.Label dangerouslySetInnerHTML={{ __html: question.question_text }}></Form.Label>
            {question.image && isImageUrl(question.image) && (
                <img src={question.image} alt="Question" style={{ maxWidth: '100%', height: 'auto' }} />
            )}
            {options.map((option, index) => (
                <Form.Check
                    type="checkbox"
                    label={isImageUrl(option) ? <img src={option} alt="Option" style={{ maxWidth: '100%', height: 'auto' }} /> : <span dangerouslySetInnerHTML={{ __html: option }}></span>}
                    id={`${question.id}-${index}`}
                    onChange={onChange}
                    disabled={disabled}
                    key={`${question.id}-${index}`}
                />
            ))}
        </Form.Group>
    );
};

export default CheckboxQuestion;