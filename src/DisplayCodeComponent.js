import Highlight from 'react-highlight'


const DisplayCode = ({ code }) => {
    return (
        <>  
            {console.log('rerender code block')}
            <Highlight>
                {code}
            </Highlight>
      
        </>
    );
}

export default DisplayCode;