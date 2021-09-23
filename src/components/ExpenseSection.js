import React, { useEffect, useState } from 'react'

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
    </div>
  )
}

const PayerPanel = ({ names, payer, setPayer }) => {
  const handlePayerSelection = name => setPayer(name)

  return (
    <div className="payer-panel">
      <p style={{display: "inline"}}>Payer: </p>
      {names.map((n, i) => (
        <button
          disabled={n === payer}
          onClick={() => handlePayerSelection(n)}
          key={i}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

const PayeePanel = ({ names, payees, setPayees }) => {
  const changeCheckStatus = idx => {
    const newPayees = [...payees]
    newPayees[idx] = !newPayees[idx]
    setPayees(newPayees)
  }

  return (
    <div>
      <p style={{display: "inline-block"}}>Payees:&nbsp;</p>
      <br/>
      {names.map((n, i) => (
        <div style={{display: "inline"}} key={i}>
          <input
            type="checkbox"
            checked={payees[i]}
            onChange={() => changeCheckStatus(i)}
          />
          <label onClick={() => changeCheckStatus(i)}>{n} </label>
          &nbsp;&nbsp;
        </div>
      ))}
    </div>
  )
}

const ExpenseList = ({ expenses, setExpenses }) => {
  const deleteExpense = expense => {
    const newExpenses = expenses.filter(e => e !== expense)
    setExpenses(newExpenses)
  }

  return (
    <>
      <p><strong>Expenses entered</strong></p>
      <div style={{border: "1px solid black"}}>
        <ul>
          {expenses.map((e, i) => (
            <li key={i}>
              {e.payer} paid ${e.amount.toFixed(2)}
              {e.description !== '' ? ` for ${e.description}` : ``}
              : {e.payeeNames.join(', ')}&nbsp;
              <button onClick={() => deleteExpense(e)}>𝘅</button>
            </li>
          ))}
        </ul>
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
      <div style={{border: "1px solid black"}}>
        <ul>
          {payments.map((p, i) => (
            <li key={i}>
              {p.debtor} → {p.debtee}: ${p.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const ExpenseSection = ({ show, names }) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [payer, setPayer] = useState('')
  const [payees, setPayees] = useState([])
  const [expenses, setExpenses] = useState([])

  // To update the payer and payees states after the initial render
  if (payees.length !== names.length)
    setPayees(names.map(n => true))

  useEffect(() => {
    setPayer(names[0])
  }, [names])

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

  const addExpense = () => {
    const convertedAmount = Number(amount)
  
    if (convertedAmount <= 0 || isNaN(convertedAmount)) return

    const newExpense = {
      amount: convertedAmount,
      description: description,
      payer: payer,
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
      <AmountBox
        amount={amount}
        setAmount={setAmount}
      />
      <button onClick={addExpense} className="submit-button">🠗</button>
      <DescriptionBox
        description={description}
        setDescription={setDescription}
      />
      <PayerPanel
        names={names}
        payer={payer}
        setPayer={setPayer}
      />
      <PayeePanel
        names={names}
        payees={payees}
        setPayees={setPayees}
      />
      <ExpenseList
        expenses={expenses}
        setExpenses={setExpenses}
      />
      <br/>
      <AmountToPaySection
        names={names}
        expenses={expenses}
      />
    </div>
  )
}

export default ExpenseSection
