// actions.js
export const setUserAnswer = (questionId, answer, categoryId) => {
    // console.log('question id:', questionId + '\nuser answer:', answer + '\ncategory id:', categoryId)
    return {
        type: 'SET_USER_ANSWER',
        payload: { questionId, answer, categoryId }
    };
};

export const setSelectedOption = (questionId, selectedOption, categoryId) => {
    return {
        type: 'SET_SELECTED_OPTION',
        payload: { questionId, selectedOption, categoryId }
    };
};
