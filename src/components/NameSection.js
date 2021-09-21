import React from 'react'

const NameBox = ({ name, defaultName, i, names, setNames }) => {
  const handleNameEntry = e => {
    const newNames = [...names]
    if (e.target.value === '') newNames[i] = `ℙ${i + 1}`
    else newNames[i] = e.target.value
    setNames(newNames)
  }

  // Use the placeholder display for default names
  if (name === defaultName) {
    return (
      <>
        <input
          value=""
          placeholder={`Person ${i + 1}`}
          onChange={handleNameEntry}
        />
        <br/>
      </>
    )
  }
  // Use normal display for user-imputted names
  else {
    return (
      <>
        <input
          value={name}
          onChange={handleNameEntry}
        />
        <br/>
      </>
    )
  }
}

/**
 * Section 2
 */
const NameSection = ({ show, numOfPeople, names, setNames,
                       setShowSection }) => {
  const namesToShow = names.slice(0, numOfPeople)

  const handleNext = () => {
    setShowSection([false, false, true])
  }

  if (!show) {
    return (
      <div>
        <h3 style={{color: "lightgray"}}>Names</h3>
      </div>
    )
  }

  return (
    <div>
      <h3>What are your names?</h3>
      <p>This is optional.</p>
      {namesToShow.map((name, i) => (
        <NameBox
          name={name}
          defaultName={`🧍${i + 1}`}
          i={i}
          names={names}
          setNames={setNames}
          key={i}
        />
      ))}
      <button onClick={handleNext}>Next</button>
    </div>
  )
}

export default NameSection
