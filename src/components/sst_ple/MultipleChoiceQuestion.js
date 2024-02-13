import React from 'react';
import { Form, Card } from 'react-bootstrap';
import { isImageUrl } from './utils';

const MultipleChoiceQuestion = ({ question, onChange, disabled, userAnswer, displayQuestionText }) => {
    const options = question.options || [];

    const handleOptionChange = (e) => {
        onChange(e.target.value);
    };

    const renderOptionLabel = (option) => {
        return isImageUrl(option) ? (
            <Card>
                <Card.Img variant="top" src={option} style={{ width: '15rem', margin: 'auto' }} />
            </Card>
        ) : (
            <>
                <div dangerouslySetInnerHTML={{ __html: option.replace(/\n/g, '<br/>') }}></div >
            </>
            // option
        );
    };

    return (
        <Form.Group>
            {displayQuestionText && <Form.Label dangerouslySetInnerHTML={{ __html: question.question_text }} />}
            {options.map((option, index) => (
                <Form.Check
                    type="radio"
                    label={renderOptionLabel(option)}
                    name={question.id}
                    value={option}
                    onChange={handleOptionChange}
                    checked={userAnswer === option}
                    disabled={disabled}
                    key={`${question.id}-${index}`}
                    id={`${question.id}-option-${index}`}
                />
            ))}
        </Form.Group>
    );
};

export default MultipleChoiceQuestion;
