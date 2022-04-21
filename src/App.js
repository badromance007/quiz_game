import './App.css';
import useDocumentTitle from './helpers/useDocumentTitle';
import Button from './components/Button';
import Question from './components/Question';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { START, PROGRESS, END } from './constants/Constants';
import Confetti from 'react-confetti';

function App() {
  useDocumentTitle('Quiz Game')

  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  const [gameStatus, setGameStatus] = useState(START)
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    getNewQuestions()
  }, [])

  function getNewQuestions() {
    fetch('https://opentdb.com/api.php?amount=5')
      .then(response => response.json())
      .then(data => {
        console.log(data.results)
        setQuestions(data.results.map(question => {
          const randomAnswers = shuffle([...question.incorrect_answers, question.correct_answer])

          return {
            ...question,
            id: nanoid(),
            chosen_answer: '',
            answers: randomAnswers
          }
        }))
      })
  }

  function shuffle(array) { // Fisher-Yates Shuffle
    let currentIndex = array.length,  randomIndex
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }
  
    return array
  }

  function startGame() {
    setGameStatus(PROGRESS)
  }

  function checkAnswers() {
    setGameStatus(END)
    getScore()
  }

  function resetGame() {
    setGameStatus(START)
    setScore(0)
    getNewQuestions()
  }

  function chooseAnswer(id, text) {
    setQuestions(oldQuestions => oldQuestions.map(oldQuestion => (
      oldQuestion.id === id ?
      {
        ...oldQuestion,
        chosen_answer: text
      } :
      oldQuestion
    )))
  }

  function getScore() {
    setScore(prevScore => {
      questions.forEach(question => {
        if (question.correct_answer === question.chosen_answer)
          prevScore++
      })
      return prevScore
    })
  }

  const questionsElements = questions.map(question => (
    <Question
      key={question.id}
      question={question}
      chooseAnswer={chooseAnswer}
      gameStatus={gameStatus}

    />
  ))

  return (
    <main>
      <div className='container'>
        {
          gameStatus === START ? 

          <div className='start-game'>
            <div className='game-description'>
              <h1>Quiz Game</h1>
              <p>Press "Start quiz" button to play. Click on each answer to answer the corresponding question. When done, click the check answers button to see the results.</p>
            </div>

            <Button
              text="Start quiz"
              sizeClass="btn-big"
              handleGame={startGame}
            />
          </div> :

          <div className='progress-game'>
            <div className='container--questions'>
              {questionsElements}
            </div>
            {
              gameStatus === PROGRESS ?
              <Button
                text="Check answers"
                sizeClass="btn-medium"
                handleGame={checkAnswers}
              /> :
              <div className='score-container'>
                <p className='score-text'>You Scored {score}/{questions.length} correct answers</p>
                <Button
                  text="Play again"
                  sizeClass="btn-medium"
                  handleGame={resetGame}
                />
              </div>
            }
            
          </div>
        }

        {
          score === questions.length &&
          <Confetti
            width={width}
            height={height}
          />
        }
      </div>
    </main>
  );
}

export default App;
