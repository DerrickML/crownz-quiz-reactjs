// AnswerInput.js
import React from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import TextInputQuestion from './TextInputQuestion';

const AnswerInput = ({ question, onChange, disabled, userAnswer, displayQuestionText = true }) => {
    switch (question.type) {
        case 'multipleChoice':
            return (
                <MultipleChoiceQuestion
                    question={question}
                    onChange={onChange}
                    disabled={disabled}
                    userAnswer={userAnswer}
                    displayQuestionText={displayQuestionText} // Pass the prop down
                />
            );
        case 'check_box':
            return (
                <CheckboxQuestion
                    question={question}
                    onChange={onChange}
                    disabled={disabled}
                    userAnswer={userAnswer}
                    displayQuestionText={displayQuestionText} // Pass the prop down
                />
            );
        case 'text':
            return (
                <TextInputQuestion
                    question={question}
                    onChange={onChange}
                    disabled={disabled}
                    userAnswer={userAnswer}
                    displayQuestionText={displayQuestionText} // Pass the prop down
                />
            );
        default:
            return null;
    }
};

export default AnswerInput;
