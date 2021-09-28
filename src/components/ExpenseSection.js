import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import deleteImg from '../images/delete.svg'

const AmountBox = ({ amount, setAmount }) => {
  const handleAmountEntry = e => {
    const numEntered = Number(e.target.value)
    if (isNaN(numEntered) && e.target.value !== '.') return
    if (numEntered < 0) return
    setAmount(e.target.value)
  }

  return (
    <div className="amount-box">
      <label for="amount">$ </label>
      <input value={amount} id="amount" onChange={handleAmountEntry} />
    </div>
  )
}

const DescriptionBox = ({ description, setDescription }) => {
  const handleDescriptionEntry = e => setDescription(e.target.value)

  return (
    <div className="description-box">
      <input
        value={description}
        placeholder="What for?"
        onChange={handleDescriptionEntry}
      />
      <div className="uneven-tooltip">
        <button className="uneven-button">
          ⅗
        </button>
        <span className="tooltiptext">Uneven split</span>
      </div>
    </div>
  )
}

const PayerPanel = ({ names, payerIdx, setPayerIdx }) => {
  const handlePayerSelection = idx => setPayerIdx(idx)

  return (
    <div className="payer-panel">
      <p style={{display: "inline"}}>Payer:&thinsp;</p>
      {names.map((n, i) => (
        <button
          disabled={i === payerIdx}
          onClick={() => handlePayerSelection(i)}
          key={i}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

const PayeePanelElement = ({ name, payees, idx, setPayees, eltClass }) => {
  if (name === null) {
    if (idx < 10) {
      return (
        <div
          className="payee-element-gt4 empty-payee-space-lt10"
        />
      )
    } else {
      return (
        <div
          className="payee-element-gt4 empty-payee-space-gt10"
        />
      )
    }
  }

  const changeCheckStatus = () => {
    const newPayees = [...payees]
    newPayees[idx] = !newPayees[idx]
    setPayees(newPayees)
  }

  return (
    <div className={eltClass}>
      <input
        type="checkbox"
        className="payee-checkbox"
        checked={payees[idx]}
        onChange={changeCheckStatus}
      />
      <span />
      <label onClick={changeCheckStatus}>{name}</label>
    </div>
  )
}

const PayeePanel = ({ names, payees, setPayees }) => {
  if (names.length > 4) {
    // Group names in sets of five
    const groupedNames = []
    names.forEach((n, i) => {
      if (i % 5 === 0) groupedNames.push([])
      groupedNames[groupedNames.length - 1].push(n)
    })
    for (let i = groupedNames[groupedNames.length - 1].length;
        i < 5; i++) {
      groupedNames[groupedNames.length - 1].push(null)
    }

    return (
      <div className="payees-gt4">
        <p>Payees:&nbsp;</p>
        {groupedNames.map((group, i) => (
          <div classname="payee-row" key={i}>
            {group.map((name, j) => (
              <PayeePanelElement
                name={name}
                payees={payees}
                idx={i*5 + j}
                setPayees={setPayees}
                eltClass="payee-element-gt4"
                key={i*5 + j}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="payees-lte4">
      <p>Payees:&nbsp;</p>
      {names.map((n, i) => (
        <PayeePanelElement
          name={n}
          payees={payees}
          idx={i}
          setPayees={setPayees}
          eltClass="payee-element-lte4"
          key={i}
        />
      ))}
    </div>
  )
}

const ExpenseList = ({ expenses, setExpenses }) => {
  const deleteExpense = expense => {
    const newExpenses = expenses.filter(e => e !== expense)
    setExpenses(newExpenses)
  }

  const formatExpenseStr = e => {
    return (
      `${e.payer} paid $${e.amount.toFixed(2)}` +
      `${e.description !== '' ? ` for ${e.description}` : ``}` +
      `: ${e.payeeNames.join(', ')}`
    ) 
  }

  return (
    <>
      <p><strong>Expenses entered</strong></p>
      <div>
        {expenses.length === 0 ? <div className="filler" /> : null}
        {expenses.map((e, i) => (
          <p className="expense-item" key={i}>
            {formatExpenseStr(e)}
            <button className="delete-button" onClick={() => deleteExpense(e)}>
              <img
                src={deleteImg}
                alt="delete"
              />
            </button>
          </p>
        ))}
      </div>
    </>
  )
}

const AmountToPaySection = ({ names, expenses }) => {
  // Initialize adjacency matrix-type representation
  const amountOwedBy = {}
  for (let n1 of names) {
    amountOwedBy[n1] = {}
    for (let n2 of names)
      amountOwedBy[n1][n2] = 0
  }

  // Fill up "adjacency matrix"
  for (let e of expenses) {
    for (let p of e.payeeNames) {
      if (p !== e.payer)
        amountOwedBy[p][e.payer] += e.payeeAmounts[p]
    }
  }

  // Optimize the matrix using the following algorithm:
  // Find all consecutive edges and reduce them. For example, if A owes B $1
  // and B owes C $1, then we reduce it such that A owes C $1.
  for (let p1 in amountOwedBy) {
    let noConsecutiveEdges = false  // a consecutive edge is an edge from A to B
                                    // combined with an edge from B to C
    while (!noConsecutiveEdges) {
      let noConsecutiveEdgeCheck = true
      for (let p2 in amountOwedBy[p1]) {
        if (amountOwedBy[p1][p2] > 0) {
          for (let p3 in amountOwedBy[p2]) {
            if (amountOwedBy[p2][p3] > 0) {
              noConsecutiveEdgeCheck = false
              if (amountOwedBy[p1][p2] >= amountOwedBy[p2][p3]) {
                amountOwedBy[p1][p3] += amountOwedBy[p2][p3]
                amountOwedBy[p1][p2] -= amountOwedBy[p2][p3]
                amountOwedBy[p2][p3] = 0
              } else {
                amountOwedBy[p1][p3] += amountOwedBy[p1][p2]
                amountOwedBy[p2][p3] -= amountOwedBy[p1][p2]
                amountOwedBy[p1][p2] = 0
              }
              break
            }
          }
        }
      }
      noConsecutiveEdges = noConsecutiveEdgeCheck
    }
  }

  // Record amounts that need to be paid
  const payments = []
  for (let p1 in amountOwedBy) {
    for (let p2 in amountOwedBy[p1]) {
      if (amountOwedBy[p1][p2] > 0) {
        payments.push({
          debtor: p1,
          debtee: p2,
          amount: amountOwedBy[p1][p2],
        })
      }
    }
  }

  return (
    <>
      <p><strong>How much to pay</strong></p>
      <div>
        {payments.length === 0 ? <div className="filler" /> : null}
        {payments.map((p, i) => (
          <p className="payment-item" key={i}>
            {p.debtor} → {p.debtee}: ${p.amount.toFixed(2)}
          </p>
        ))}
      </div>
    </>
  )
}

const ExpenseSection = ({ show, names }) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [payerIdx, setPayerIdx] = useState(0)
  const [payees, setPayees] = useState([])
  const [expenses, setExpenses] = useState([])

  // To update the payees state after the initial render
  if (payees.length !== names.length)
    setPayees(names.map(n => true))

  if (!show) {
    return (
      <div className="expense-section">
        <h3 style={{color: "lightgray"}}>Expenses</h3>
      </div>
    )
  }

  const calculateAmountOwedToPayer = () => {
    const numOfPayees = payees.reduce((s, p) => s + p, 0)
    const indivAmounts = {}
    names.forEach((n, i) => {
      if (payees[i]) indivAmounts[n] = amount / numOfPayees
      else indivAmounts[n] = 0
    })
    return indivAmounts
  }

  const addExpense = e => {
    e.preventDefault()

    const convertedAmount = Number(amount)
  
    if (convertedAmount <= 0 || isNaN(convertedAmount)) return

    const newExpense = {
      amount: convertedAmount,
      description: description,
      payer: names[payerIdx],
      payeeNames: names.filter((n, i) => payees[i]),
      payeeAmounts: calculateAmountOwedToPayer(),
    }

    setExpenses(expenses.concat(newExpense))

    setAmount('')
    setDescription('')
  }

  return (
    <div className="expense-section">
      <h3>Enter your expenses:</h3>
      <form className="expense-form">
        <AmountBox
          amount={amount}
          setAmount={setAmount}
        />
        <button onClick={addExpense} className="submit-button" type="submit">
          🠗
        </button>
        <DescriptionBox
          description={description}
          setDescription={setDescription}
        />
        <PayerPanel
          names={names}
          payerIdx={payerIdx}
          setPayerIdx={setPayerIdx}
        />
        <PayeePanel
          names={names}
          payees={payees}
          setPayees={setPayees}
        />
      </form>
      <Row className="calc-section" xs={1} lg={2}>
        <Col className="expenses-entered-section">
          <ExpenseList
            expenses={expenses}
            setExpenses={setExpenses}
          />
        </Col>
        <Col className="payment-amount-section">
          <AmountToPaySection
            names={names}
            expenses={expenses}
          />
        </Col>
      </Row>
    </div>
  )
}

export default ExpenseSection
