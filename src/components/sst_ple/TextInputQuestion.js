// TextInputQuestion.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { isImageUrl } from './utils';

const TextInputQuestion = ({ question, onChange, disabled }) => {
    return (
        <Form.Group>
            <Form.Label dangerouslySetInnerHTML={{ __html: question.question_text }}></Form.Label>
            {question.image && isImageUrl(question.image) && (
                <div>
                    <img src={question.image} alt="Question" style={{ width: 'auto', height: '100px' }} />
                </div>
            )}
            <Form.Control
                type="text"
                id={question.id}
                onChange={onChange}
                disabled={disabled}
            />
        </Form.Group>
    );
};

export default TextInputQuestion;