import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuizContainer from './sst_ple/QuizContainer';
import { sst_ple, math_ple } from '../otherFiles/questionsData';

function App() {
  return (
    <div className="App">
      {/* Social studies questions */}
      <QuizContainer questionsData={sst_ple} />

      {/* Maths questions */}
      {/* <QuizContainer questionsData={math_ple} /> */}
    </div>
  );
}

export default App;
