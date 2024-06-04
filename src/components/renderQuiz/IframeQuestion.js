// IframeQuestion.js
import React, { useEffect, useRef } from 'react';
import Iframe from 'react-iframe';

const IframeQuestion = ({ question, onChange, displayQuestionText, questionNumber, iframeId }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== new URL(question).origin) return;
            if (event.data && event.data.type === 'iframeData' && event.data.id === iframeId) {
                onChange(event.data.payload);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [question, onChange, iframeId]);

    return (
        <div>
            {displayQuestionText &&
                <p>{questionNumber}. <span dangerouslySetInnerHTML={{ __html: question }} /></p>
            }
            <Iframe url={question} width="100%" height="400px" ref={iframeRef} id={iframeId} />
        </div>
    );
};

export default IframeQuestion;
