import React, { useState } from 'react'

const ErrorMessage = ({ message }) => {
  if (message === '') return null
  return <p style={{color: "red"}}>{message}</p>
}

const NumPeopleInputBox = ({ numOfPeople, setNumOfPeople }) => {
  const handleNumOfPeopleEntry = e => {
    const numEntered = Number(e.target.value)
    if (isNaN(numEntered)) return
    if (numEntered % 1 !== 0) return  // float check
    setNumOfPeople(numEntered)
  }

  // Render a different initial input box
  if (numOfPeople === 0)
    return <input value="" placeholder="2" onChange={handleNumOfPeopleEntry} />
  else
    return <input value={numOfPeople} onChange={handleNumOfPeopleEntry} />
}

/**
 * Section 1
 */
const NumPeopleSection = ({ show, numOfPeople, setNumOfPeople,
                            setShowSection }) => {
  const [errorMessage, setErrorMessage] = useState('')

  const handleNext = () => {
    // If the user didn't key in anything, use the default value of 2
    if (numOfPeople === 0) {
      setNumOfPeople(2)
      setShowSection([false, true, false])
    }
    // If the user did key in a number, check that it is valid
    else if (numOfPeople >= 2 && numOfPeople <= 20) {
      setShowSection([false, true, false])
    }
    // If invalid, display an error message
    else {
      setErrorMessage(
        `${numOfPeople} is not valid. Please enter a number from 2-20.`
      )
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  if (!show) {
    return (
      <div>
        <h3 style={{color: "lightgray"}}>How many people?</h3>
      </div>
    )
  }

  return (
    <div>
      <h3>How many people?</h3>
      <p>Enter a number from 2 to 20.</p>
      <ErrorMessage
        message={errorMessage}
      />
      <NumPeopleInputBox
        numOfPeople={numOfPeople}
        setNumOfPeople={setNumOfPeople}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  )
}

export default NumPeopleSection
