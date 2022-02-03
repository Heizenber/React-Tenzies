
import './App.css';
import React from "react"
import Die from "./components/Die"
import Dot from "./components/Dots"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rolls, setRolls] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const ref = React.useRef
  let bestScore = null
  try {
      bestScore = JSON.parse(localStorage.getItem('bestTime'))
  } catch (e) {
      bestScore = null
  } 
  React.useEffect(() => {
      ref.current = setInterval(() => {
          setCount(count + 1);
          }, 1000);
      return () => {
          clearInterval(ref.current);
      }
  }, [count])
  
  React.useEffect(() => {
      
      const allHeld = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)
      
      
      if (allHeld && allSameValue) {
          setTenzies(true)
          if (!bestScore) {
              localStorage.setItem('bestTime', JSON.stringify(count))
          }
          else if (bestScore > count){
              localStorage.setItem('bestTime', JSON.stringify(count))
          }  
      }
  }, [dice])
  

  function generateNewDie() {
      let generatedValue = Math.ceil(Math.random() * 6)
      return {
          dots: generateDots(generatedValue),
          isHeld: false,
          id: nanoid()
      }
  }
  
  function generateDots(value) {
      const dots = []
      for (let i = 0; i < value; i++) {
          dots.push(<Dot key={nanoid()}/>)
      }
      return dots
  }
  
  function allNewDice() {
      const newDice = []
      for (let i = 0; i < 10; i++) {
          newDice.push(generateNewDie())
      }
      return newDice
  }
  
  function rollDice() {
      setRolls(prevRolls => prevRolls + 1)
      if(!tenzies) {
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
      } else {
          setTenzies(false)
          setDice(allNewDice())
          setRolls(0)
          clearInterval(ref.current)
          setCount(0)
      }
      
  }
  
  function holdDice(id) {
      setDice(oldDice => oldDice.map(die => {
          return die.id === id ? 
              {...die, isHeld: !die.isHeld} :
              die
      }))
  }
  
  const diceElements = dice.map(die => (
      <Die 
          key={die.id} 
          isHeld={die.isHeld} 
          holdDice={() => holdDice(die.id)}
          dots={die.dots}
      />
  ))
  
  return (
      <main>
          {tenzies && <Confetti />}
          <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same. 
          Click each die to freeze it at its current value between rolls.</p>
          <div className="dice-container">
              {diceElements}
          </div>
          {bestScore && <p className="bestTime">Previous best time: {localStorage.getItem('bestTime')}</p>}
          <p className="time">Time passed in seconds: {count}</p>
          <p className="rolls">Number of rolls: {rolls}</p>
          <button 
              className="roll-dice" 
              onClick={rollDice}
          >
              {tenzies ? "New Game" : "Roll"}
          </button>
      </main>
  )
}