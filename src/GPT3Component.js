import {Configuration, OpenAIApi } from 'openai';
import React, { useState } from 'react';
import './App.css';

const GPT3Component = ({ apiKey }) => {
  const [inputText, setInputText] = useState('');
  const [savedInputText, setSavedInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const configuration = new Configuration ({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);
  
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(apiKey)
      },
      body: JSON.stringify({
        'model' : 'text-davinci-003',
        'prompt': inputText,
        'temperature': 0.8,
        'max_tokens': 500,
        'top_p': 1,
        'frequency_penalty': 1,
        'presence_penalty': 0.5,
        'stop': ["\"\"\""],
      })
    };
    fetch('https://api.openai.com/v1/completions', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setOutputText (data.choices[0].text)
          setSavedInputText(inputText);
          setInputText('');
          setIsLoading(false);
    
          
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
      {
        isLoading &&
      <p>Funderar på vad jag ska svara...</p>
      }
      {!isLoading &&
      <div>
        <p> Input: {savedInputText}</p> 
        <textarea className='Answer' value={outputText} ></textarea>
      </div>
      }
        
      </div>
      
    </div>
  );
};

export default GPT3Component;