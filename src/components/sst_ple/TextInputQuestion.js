// TextInputQuestion.js
import React from 'react';
import { Form } from 'react-bootstrap';

const TextInputQuestion = ({ question, onChange, disabled, userAnswer, displayQuestionText }) => {
    return (
        <Form.Group>
            {displayQuestionText && <Form.Label dangerouslySetInnerHTML={{ __html: question.question_text }} />}
            <Form.Control
                type="text"
                value={userAnswer || ''} // Set the value to userAnswer
                onChange={e => onChange(e.target.value)} // Call onChange with the new value
                disabled={disabled}
            />
        </Form.Group>
    );
};

export default TextInputQuestion;
