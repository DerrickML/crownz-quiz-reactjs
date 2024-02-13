import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuizContainer from './sst_ple/QuizContainer';
import AnswerContainer from './displayAnswer/AnswerContainer';
// import SaveButton from './sst_ple/SaveButton';
import { sst_ple, math_ple, sst_ple_ans, math_ple_ans } from '../otherFiles/questionsData';

function App() {
  return (
    <div className="App">
      {/* Social studies questions */}
      {/* <QuizContainer questionsData={sst_ple} subjectName={'sst_ple'} /> */}

      {/* Maths-ple questions */}
      {/* <QuizContainer questionsData={math_ple} subjectName={'math_ple'} /> */}

      {/* <SaveButton questionsData={sst_ple} /> */}

      {/* -------display answers-------- */}

      {/* Maths answers */}
      {/* <AnswerContainer questionsData={math_ple_ans} subjectName={'math_ple'} /> */}

      {/* sst-ple answers */}
      <AnswerContainer questionsData={sst_ple_ans} subjectName={'sst_ple'} />
    </div>
  );
}

export default App;
