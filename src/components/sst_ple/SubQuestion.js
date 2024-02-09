import React from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import CheckboxQuestion from './CheckboxQuestion';
import TextInputQuestion from './TextInputQuestion';

const SubQuestion = ({ subQuestion }) => {
    switch (subQuestion.type) {
        case 'multipleChoice':
            return <MultipleChoiceQuestion question={subQuestion} />;
        case 'check_box':
            return <CheckboxQuestion question={subQuestion} />;
        case 'text':
            return <TextInputQuestion question={subQuestion} />;
        default:
            return null;
    }
};

export default SubQuestion;