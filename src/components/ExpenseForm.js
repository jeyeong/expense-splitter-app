import React, { useState, useEffect } from 'react'
import NumPeopleSection from './NumPeopleSection'

const AmountBox = ({ amount, setAmount, errorMessage }) => {
  const handleAmountEntry = e => {
    const numEntered = Number(e.target.value)
    if (isNaN(numEntered) && e.target.value !== '.') return
    if (numEntered < 0) return
    setAmount(e.target.value)
  }

  return (
    <div
      className={
        (errorMessage === "Please enter a valid amount."
          ? "amount-box-error "
          : "") +
        "amount-box"
      }
    >
      <label htmlFor="amount">$</label>
      <input value={amount} id="amount" onChange={handleAmountEntry} />
    </div>
  )
}

const ModeSelector = ({ mode, setMode }) => {
  const changeMode = (e, newMode) => {
    e.preventDefault()
    if (newMode !== mode) setMode(newMode)
  }

  return (
    <div className="mode-selector">
      <div>
        <button
          className={mode === "even" ? "activated-mode" : "deactivated-mode"}
          onClick={e => changeMode(e, "even")}
        >
          Even
        </button>
        <button
          className={mode === "uneven" ? "activated-mode" : "deactivated-mode"}
          onClick={e => changeMode(e, "uneven")}
        >
          Uneven
        </button>
      </div>
    </div>
  )
}

const PayerSelection = ({ names, payerIdx, setPayerIdx }) => {
  const handlePayerSelection = (e, idx) => {
    e.preventDefault()
    setPayerIdx(idx)
  }

  return (
    <div className="payer-selection">
      <div className="payer-title">
        <div>Who paid?</div>
      </div>
      <div className="payer-frame">
        {names.map((n, i) => (
          <button
            className="payer-item"
            disabled={i === payerIdx}
            onClick={e => handlePayerSelection(e, i)}
            key={i}
          >
            <p>{n}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

const PayeeSelection = ({ names, payees, setPayees, errorMessage }) => {
  const changePayeeStatus = (e, i) => {
    e.preventDefault()
    setPayees(payees.map((p, idx) => idx === i ? !p : p))
  }

  return (
    <div
      className={
        (errorMessage === "Please select at least one payee."
          ? "payee-selection-error "
          : "") +
        "payee-selection"
      }
    >
      <div className="payee-title">
        <div>Who's involved?</div>
      </div>
      <div className="payee-frame">
        {names.map((n, i) => (
          <div
            className={"payee-item-container"}
            key={i}
          >
            <button
              className={payees[i] ? "payee-item-enabled" : "payee-item-disabled"}
              onClick={e => changePayeeStatus(e, i)}
            >
              <p>{n}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const SubmitButton = ({ submitExpenseHandler }) => {
  const submitExpense = e => {
    e.preventDefault()
    submitExpenseHandler()
  }

  return (
    <div className="submit-button">
      <button type="submit" onClick={submitExpense}>
        Submit
      </button>
    </div>
  )
}

const ExpenseForm = ({ names, expenses, setExpenses }) => {
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState("even")
  const [payerIdx, setPayerIdx] = useState(0)
  const [payees, setPayees] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // To update the payee state after the initial render
  if (payees.length !== names.length)
    setPayees(names.map(n => true))


  // Helper function for setting error messages
  const errorMessageWithTimer = (message, duration) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), duration)
  }

  // Helper function for 2dp rounding
  const roundUpTo2DecimalPlaces = number => Math.ceil(number * 100) / 100

  // Submit expense
  const submitExpenseHandler = () => {
    // Amount validation
    const amountAsNumber = Number(amount)
    if (amountAsNumber <= 0 || isNaN(amountAsNumber)) {
      errorMessageWithTimer("Please enter a valid amount.", 5000)
      return
    }

    // Payee validation
    if (payees.find(p => p) === undefined) {
      errorMessageWithTimer("Please select at least one payee.", 5000)
      return
    }

    // Create new expense object
    const newExpense = {
      isUneven: mode === "uneven",
      amount: roundUpTo2DecimalPlaces(amountAsNumber),
      payer: names[payerIdx],
      payeeNames: names.filter((n, i) => (
        payees[i]
      )),
      // payeeAmounts
    }

    // Add new expense to expenses list
    setExpenses(expenses.concat(newExpense))

    console.log(newExpense)

    // Reset expense form (certain fields)
    setAmount('')
    setErrorMessage('')
  }

  return (
    <div>
      <form>
        <div className="expense-form">
          <div>
            <AmountBox
              amount={amount}
              setAmount={setAmount}
              errorMessage={errorMessage}
            />
            <ModeSelector
              mode={mode}
              setMode={setMode}
            />
            <div className="payer-payee-section">
              <PayerSelection
                names={names}
                payerIdx={payerIdx}
                setPayerIdx={setPayerIdx}
              />
              <PayeeSelection
                names={names}
                payees={payees}
                setPayees={setPayees}
                errorMessage={errorMessage}
              />
            </div>
          </div>
        </div>
        <NumPeopleSection.ErrorMessage
          message={errorMessage}
          nameOfClass="expense-form-error"
        />
        <div className="test2">
          <div className="test">
            <div></div>
            <SubmitButton
              submitExpenseHandler={submitExpenseHandler}
            />
            <div>↓</div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
