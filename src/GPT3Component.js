import {Configuration, OpenAIApi } from 'openai';
import React, { useState } from 'react';
import './App.css';

const GPT3Component = ({ apiKey }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const myKey = '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';
  const configuration = new Configuration ({
    apiKey: myKey,
  });
  const openai = new OpenAIApi(configuration);
  
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(myKey)
      },
      body: JSON.stringify({
        'prompt': 'Brainstorm some ideas combining VR and fitness:',
        'temperature': 0.1,
        'max_tokens': 50,
        'top_p': 1,
        'frequency_penalty': 0,
        'presence_penalty': 0.5,
        'stop': ["\"\"\""],
      })
    };
    fetch('https://api.openai.com/v1/engines/code-davinci-001/completions', requestOptions)
        .then(response => response.json())
        .then(data => {
          setOutputText (data.choices[0].text)
          console.log(outputText)
      }).catch(err => {
        console.log("Ran out of tokens for today! Try tomorrow!");
      });
  }
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Input text:
          <textarea value={inputText} onChange={(event) => setInputText(event.target.value)} />
        </label>
        <button type="submit">Generate</button>
      </form>
      <div> 
      <textarea className='Answer' value={outputText} ></textarea>
        
      </div>
      
    </div>
  );
};

export default GPT3Component;