// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuizContainer from './sst_ple/QuizContainer';
import questionsData from '../otherFiles/questionsData';

function App() {
  return (
    <div className="App">
      <QuizContainer questionsData={questionsData} />
    </div>
  );
}

export default App;
