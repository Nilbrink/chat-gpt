import {Configuration, OpenAIApi } from 'openai';
import React, { useEffect, useState } from 'react';
import './App.css';
import './ConvertTime'
import { ConvertTime } from './ConvertTime';

const GPT3Component = ({ apiKey }) => {
  
  const configuration = new Configuration ({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);  

  const [inputText, setInputText] = useState('');
  const [savedInputText, setSavedInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationMessages, setConversationMessages] = useState([]) 
  const [lastUserMessages, setLastUserMessages] = useState(null)
  const [lastAIMessages, setlastAIMessages] = useState(null)

  const [messageTitle, setMessageTitle]= useState(null)
  
  // Clear current conversation
  const clearConversation = () => {
    setConversationMessages([])
    setOutputText('[tog bort konversationen]')
    setMessageTitle(null)

  }
  
  // Handle user input submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    var userMessage = {"role": "user", "content": inputText}
    var newMessage = [...conversationMessages, userMessage]
    var messageTitle = null
    setLastUserMessages(userMessage)
    

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(apiKey)
      },
      body: JSON.stringify({
        'model' : 'gpt-3.5-turbo',
        "messages": newMessage,
        'temperature': 0.8,
        'max_tokens': 500,
        'top_p': 1,
        'frequency_penalty': 1,
        'presence_penalty': 0.5,
        'stop': ["\"\"\""],
        
      })
    };
    fetch('https://api.openai.com/v1/chat/completions', requestOptions)
        .then(response => response.json())
        .then(data => {
          setMessageTitle(data.choices[0].message.role + ' ' + ConvertTime(data.created) + '\n')
          setlastAIMessages(data.choices[0].message)
          setOutputText(data.choices[0].message.content)
          setSavedInputText(inputText);
          setInputText('');
          setIsLoading(false);
          console.log(data)
          
      }).catch(err => {
        console.log("There was an error in the fetch");
      });
  }
  useEffect( () => {
    if (lastAIMessages && lastAIMessages)
      setConversationMessages([...conversationMessages, lastUserMessages, lastAIMessages])
    }, [lastAIMessages])
  
    useEffect( () => {
      console.log(conversationMessages)

      }, [conversationMessages])
    
  

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
        <p>
          <p> Konversationen har {conversationMessages.length} meddelanden</p>
          <button onClick={clearConversation}>
            Nollställ konversation
          </button>
          </p>
        <p> Input: {savedInputText}</p> 
        <div className='answer'>
          <p>
            {messageTitle}
            {outputText}
          </p>
          </div>
      </div>
      }
        
      </div>
      
    </div>
  );
};

export default GPT3Component;