// AnswerCard.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import AnswerCard from './AnswerCard';

describe('AnswerCard', () => {
    const resultsData = {
        question: 'What is the capital of France?',
        image: 'https://example.com/image.jpg',
        explanation: 'Paris is the capital of France.',
        answer: 'Paris',
        user_answer: 'Paris',
        type: 'multipleChoice',
        mark: 1,
        sub_questions: [
            {
                question: 'What is the currency of France?',
                image: 'https://example.com/currency.jpg',
                explanation: 'The currency of France is Euro.',
                answer: 'Euro',
                user_answer: 'Euro',
                type: 'text',
                mark: 1,
            },
        ],
    };

    it('renders the question text', () => {
        render(<AnswerCard resultsData={resultsData} />);
        expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    });

    it('renders the question image', () => {
        render(<AnswerCard resultsData={resultsData} />);
        expect(screen.getByAltText('Question')).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders the user answer', () => {
        render(<AnswerCard resultsData={resultsData} />);
        expect(screen.getByText('Your Answer')).toBeInTheDocument();
        expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    it('renders the correct answer', () => {
        render(<AnswerCard resultsData={resultsData} />);
        expect(screen.getByText('Correct Answer')).toBeInTheDocument();
        expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    it('renders the explanation', () => {
        render(<AnswerCard resultsData={resultsData} />);
        expect(screen.getByText('Explanation')).toBeInTheDocument();
        expect(screen.getByText('Paris is the capital of France.')).toBeInTheDocument();
    });

    it('renders the score', () => {
        render(<AnswerCard resultsData={resultsData} />);
        expect(screen.getByText('Score')).toBeInTheDocument();
        expect(screen.getByText('1/1')).toBeInTheDocument();
    });

    it('renders sub-questions', () => {
        render(<AnswerCard resultsData={resultsData} />);
        expect(screen.getByText('What is the currency of France?')).toBeInTheDocument();
        expect(screen.getByText('The currency of France is Euro.')).toBeInTheDocument();
    });
});