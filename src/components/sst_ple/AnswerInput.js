// AnswerInput.js
import React from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import TextInputQuestion from './TextInputQuestion';

const AnswerInput = ({ question, onChange, disabled, userAnswer }) => {
    console.log("Received questions:\n", question);

    switch (question.type) {
        case 'multipleChoice':
            return (
                <MultipleChoiceQuestion
                    question={question}
                    onChange={onChange}
                    disabled={disabled}
                    userAnswer={userAnswer}
                />
            );
        case 'check_box':
            return (
                <CheckboxQuestion
                    question={question}
                    onChange={onChange}
                    disabled={disabled}
                    userAnswer={userAnswer}
                />
            );
        case 'text':
            return (
                <TextInputQuestion
                    question={question}
                    onChange={onChange}
                    disabled={disabled}
                    userAnswer={userAnswer}
                />
            );
        default:
            return null;
    }
};

export default AnswerInput;
