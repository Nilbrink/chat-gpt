import { Configuration, OpenAIApi } from 'openai';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import './ConvertTime'
import './DisplayCodeComponent'
import { ConvertTime } from './ConvertTime';
import classNames from 'classnames';

import DisplayCode from './DisplayCodeComponent';

const GPT3Component = ({ apiKey }) => {

  const configuration = new Configuration({
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

  const [messageTitle, setMessageTitle] = useState(null)

  // Clear current conversation
  const clearConversation = () => {
    setConversationMessages([])
    setOutputText('[tog bort konversationen]')
    setMessageTitle(null)

  }

  var str = ''
  var matchCount = 0

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const wrapTags = (text, regex, className, role) => {
    const textArray = text.split(regex);

    return textArray.map(str => {
      if (matchCount % 2) {
        matchCount++
        return str
      }
      else {
        matchCount++
        if (role === 'assistant')
          return <DisplayCode code={str} />

        else
          return str
      }
    });
  };

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    if (inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom()
  }, [conversationMessages]);

 

  
  // ToDo: This rerenders the page all the time wich makes the system unusable
  // Fix separate handleKeyDown that submits form on enter  

  // Handle user input submit
  const handleSubmit = async (event) => {
    
      event.preventDefault();
      setIsLoading(true);
      var userMessage = { "role": "user", "content": inputText }
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
          'model': 'gpt-3.5-turbo',
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
          setMessageTitle(ConvertTime(data.created) + '\n')
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
  useEffect(() => {
    if (lastAIMessages)
      setConversationMessages([...conversationMessages, lastUserMessages, lastAIMessages])
  }, [lastAIMessages])


  return (
    <section className={classNames('chat', 'center')}>
      <div className='header-chat'>
        <div>
          <p> Conversation has {conversationMessages.length} messages</p>
        </div>
        <div className='test'>
          <p>
            <button onClick={clearConversation}>
              Clear
            </button>
          </p>
        </div>
      </div>
      <div className='messages-chat'>
        {conversationMessages.map(mes =>
          <div className={classNames('message', 'text-only', mes.role === 'user' ? 'userinput' : '')}>
            <p className='text'> {wrapTags(mes.content, /```/g, 'codeblock', mes.role)} </p>
          </div>
        )}
        {isLoading &&
          <>
            <div className={classNames('message', 'text-only', 'userinput')}>
              <p className='text'>{inputText}</p>
            </div>
            <div className={classNames('message', 'text-only')}>
              <p className={classNames('text', 'animation')}>Thinking about my answer....</p>
            </div>

          </>
        }
        <div ref={messagesEndRef} />
        {scrollToBottom()}
      </div>
      <div class="footer-chat">

        {!isLoading &&
         <form onSubmit={handleSubmit}> 
          <input type="text" class="write-message" placeholder="Skriv meddelande" value={inputText}  onChange={(event) => setInputText(event.target.value)} ref={inputRef}></input>
          </form>
        }
      </div>
    </section>


  );
};

export default GPT3Component;