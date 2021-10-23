import React from 'react'

const DishSection = ({ names, dishNumber, setDishNumber, dishAmount,
                       setDishAmount, payees, setPayees, mealAmounts,
                       setMealAmounts }) => {
  const handleAmountEntry = e => {
    const numEntered = Number(e.target.value)
    if (isNaN(numEntered) && e.target.value !== '.') return
    if (numEntered < 0) return
    setDishAmount(e.target.value)
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    
    // Validate amount
    const amountAsNumber = Number(dishAmount)
    if (amountAsNumber <= 0 || isNaN(amountAsNumber)) return

    // Validate payees
    if (payees.find(p => p) === undefined) return

    // Update amounts by person
    const roundedAmount = Math.ceil(amountAsNumber * 100) / 100
    const numOfPayees = payees.reduce((s, p) => s + p, 0)
    const amountPerPerson = roundedAmount / numOfPayees
    setMealAmounts(
      mealAmounts.map((a, i) => (
        payees[i] ? a + amountPerPerson : a
      ))
    )

    // Update form fields
    setDishAmount('')
    setDishNumber(dishNumber + 1)
  }

  const changePayeeStatus = (e, i) => {
    e.preventDefault()
    setPayees(payees.map((p, idx) => idx === i ? !p : p))
  }

  return (
    <div className="dish-section">
      <div className="dish-section-title">
        <span>{`DISH ${dishNumber}`}</span>
      </div>
      <div className="dish-section-form">
        <form>
          <div className="dish-form-amount">
            <input
              value={dishAmount}
              placeholder="0.00"
              onChange={handleAmountEntry}
            />
            <button type="submit" onClick={handleFormSubmit}>✓</button>
          </div>
          <div className="dish-form-payees custom-scrollbar-horizontal">
            {names.map((n, i) => (
              <button
                key={i}
                className={payees[i] ? "dish-payee-activated" : "dish-payee-deactivated"}
                onClick={e => changePayeeStatus(e, i)}
              >
                {n}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}

const MealAmounts = ({ names, mealAmounts, setMealAmounts, left,
                       setDishNumber, setDishAmount }) => {
  const resetMealAmounts = e => {
    e.preventDefault()
    setMealAmounts(names.map(n => 0))
    setDishNumber(1)
    setDishAmount('')
  }

  return (
    <div className="meal-amounts">
      <div
        className={
          "uneven-amounts" +
          (left === 0
            ? ""
            : left > 0 ? " uneven-amounts-positive" : " uneven-amounts-negative")
        }
      >
        <div className="uneven-amounts-frame custom-scrollbar uneven-scrollbar">
          {names.map((n, i) => (
            <div
              className="uneven-amounts-container"
              key={i}
            >
              <div className="uneven-amount-name">{n}</div>
              <div className="uneven-amount-form meals-amount-form">
                <label>$</label>
                <input
                  value={mealAmounts[i].toFixed(2)}
                  disabled
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="meals-reset-button" onClick={resetMealAmounts}>
        Reset
      </button>
    </div>
  )
}

const TabulationBoxes = ({ target, total, mealAmounts, setMealAmounts }) => {
  const left = target - total

  const splitRemaining = () => {
    // Edge case: all $0.00s, in which case this is an even split
    if (mealAmounts.find(a => a !== 0) === undefined) {
      const amountPerPerson = left / mealAmounts.length
      setMealAmounts(mealAmounts.map(a => amountPerPerson))
      return
    }

    // Normal case
    const proportions = mealAmounts.map(a => a / total)
    setMealAmounts(
      mealAmounts.map((a, i) => a + proportions[i] * left)
    )
  }

  return (
    <div className="uneven-tabulation-boxes">
      <div className="tabulation-box">
        <span>TOTAL</span>
        <div>
          {`$${total.toFixed(2)}`}
        </div>
      </div>
      <div
        className={
          "tabulation-box left-box" +
          (left === 0
            ? ""
            : left > 0 ? " left-box-positive" : " left-box-negative")
        }
      >
        <span>LEFT</span>
        <div>
          {`$${left.toFixed(2)}`}
        </div>
      </div>
      <div className="split-remaining" onClick={splitRemaining}>
        Split Tax/Tip
      </div>
    </div>
  )
}

const PayerSelection = ({ names, payerIdx, setPayerIdx }) => {
  const handlePayerSelection = e => setPayerIdx(Number(e.target.value))

  return (
    <div className="dish-payer-selection">
      <p>Who paid?</p>
      <select value={payerIdx} onChange={handlePayerSelection}>
        {names.map((n, i) => (
          <option value={i} key={i}>
            {n}
          </option>
        ))}
      </select>
    </div>
  )
}

const exportObject = {
  DishSection,
  MealAmounts,
  TabulationBoxes,
  PayerSelection
}

export default exportObject
