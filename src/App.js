
import './App.css';
import GPT3Component from './GPT3Component';

import {Configuration, OpenAIApi} from 'openai'

const App = () => {
  const apiKey = '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';
  
  

  return (
    <div>
      <h1>GPT-3 Demo</h1>
      <GPT3Component apiKey={apiKey} />
    </div>
  );
};


export default App;
