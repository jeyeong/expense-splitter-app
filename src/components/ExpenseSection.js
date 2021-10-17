import React, { useState } from 'react'
import ExpenseForm from './ExpenseForm'
import UnevenConsole from './UnevenConsole'
import ExpenseList from './ExpenseList'
import deleteButton from '../images/delete.svg'

const DescriptionBox = ({ description, setDescription,
                          doUneven, setDoUneven }) => {
  const handleDescriptionEntry = e => setDescription(e.target.value)

  const handleUnevenToggler = e => {
    e.preventDefault()
    setDoUneven(!doUneven)
  }

  return (
    <div className="description-box">
      <input
        value={description}
        placeholder="What for?"
        onChange={handleDescriptionEntry}
      />
      <div className="uneven-tooltip" onClick={handleUnevenToggler}>
        <button className={doUneven ? "uneven-button-enabled" : "uneven-button"}>
          ⅗
        </button>
        <span className="tooltiptext">Uneven split</span>
      </div>
    </div>
  )
}

const PayeePanelElement = ({ name, payees, idx, setPayees, eltClass }) => {
  if (name === null) {
    // For CSS styling purposes
    if (idx < 10) {
      return (
        <div className="payee-element-gt4 empty-payee-space-lt10" />
      )
    } else {
      return (
        <div className="payee-element-gt4 empty-payee-space-gt10" />
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
      <label onClick={changeCheckStatus}>{name}</label>
    </div>
  )
}

const PayeePanel = ({ names, payees, setPayees, doUneven, amount,
                      unevenSplitAmounts, setUnevenSplitAmounts }) => {
  if (doUneven) {
    return (
      <UnevenConsole
        names={names}
        amount={amount}
        payees={payees}
        setPayees={setPayees}
        unevenSplitAmounts={unevenSplitAmounts}
        setUnevenSplitAmounts={setUnevenSplitAmounts}
      />
    )
  }

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
        <p>Who's involved?&thinsp;</p>
        {groupedNames.map((group, i) => (
          <div className="payee-row" key={i}>
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
      <p>Who's involved?&thinsp;</p>
      <div className="payee-row">
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
    </div>
  )
}

const ExpenseListItem = ({ expense, deleteExpense }) => {
  // State that controls the expand button (uneven only)
  const [expandUneven, setExpandUneven] = useState(false)

  const changeExpandStatus = () => setExpandUneven(!expandUneven)

  const formatExpenseStr = () => {
    const formatPayeeNames = () => {
      if (expense.isUneven && expandUneven) {
        let retStr = ""
        expense.payeeNames.forEach((n, i) => {
          retStr = retStr + `${n} ($${expense.payeeAmounts[n].toFixed(2)})`
          if (i !== expense.payeeNames.length - 1)
            retStr = retStr + ", "
        })
        return retStr
      }
      return expense.payeeNames.join(', ')
    }

    return (
      `${expense.payer} paid $${expense.amount.toFixed(2)}` +
      `: ${formatPayeeNames()}`
    ) 
  }

  return (
    <p className="expense-item">
      {formatExpenseStr()}
      {expense.isUneven
        ? <button className="expand-button" onClick={changeExpandStatus}>
            {expandUneven ? "<" : "..."}
          </button>
        : null
      }
      <button className="delete-button" onClick={() => deleteExpense(expense)}>
        <img
          src={deleteButton}
          alt="delete"
        />
      </button>
    </p>
  )
}

// const ExpenseList = ({ expenses, setExpenses }) => {
//   const deleteExpense = expense => {
//     setExpenses(expenses.filter(e => e !== expense))
//   }

//   return (
//     <div className="expenses-entered-section">
//       {/* {expenses.length === 0 ? <div className="filler" /> : null} */}
//       {expenses.map((e, i) => (
//         <ExpenseListItem
//           expense={e}
//           deleteExpense={deleteExpense}
//           key={i}
//         />
//       ))}
//     </div>
//   )
// }

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
            {p.debtor} 🠖 {p.debtee}: ${p.amount.toFixed(2)}
          </p>
        ))}
      </div>
    </>
  )
}

const ExpenseSection = ({ show, names }) => {
  const [expenses, setExpenses] = useState([])

  if (!show) return null

  // Calculate the individual amounts owed for even splitting
  // const calculateEvenSplit = roundedAmount => {
  //   const numOfPayees = payees.reduce((s, p) => s + p, 0)
  //   const indivAmounts = {}
  //   names.forEach((n, i) => {
  //     if (payees[i]) indivAmounts[n] = roundedAmount / numOfPayees
  //     else indivAmounts[n] = 0
  //   })
  //   return indivAmounts
  // }

  // Set the individual amounts owed for uneven splitting
  // const handleUnevenSplit = roundedTarget => {
  //   // Compute the sum of individual amounts
  //   const total = unevenSplitAmounts.reduce((sum, amount, i) => {
  //     if (amount === ".") return sum
  //     if (payees[i]) return (sum + roundUpTo2DecimalPlaces(Number(amount)))
  //     return sum
  //   }, 0)

  //   // Check if that sum matches the target total
  //   if (total != roundedTarget) {
  //     setErrorMsgWithTimer(
  //       `Sum of individual amounts ($${total.toFixed(2)}) does not match ` +
  //       `the expense total ($${roundedTarget.toFixed(2)}).`, 6000
  //     )
  //     return false
  //   }

  return (
    <div className="expense-section">
      <h3 className="expense-form-title">Enter your expense</h3>
      <ExpenseForm
        names={names}
        expenses={expenses}
        setExpenses={setExpenses}
      />
      <h3 className="expenses-entered-title">Expenses you've entered</h3>
      <ExpenseList
        expenses={expenses}
        setExpenses={setExpenses}
      />


      {/* <form className="expense-form">
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
          doUneven={doUneven}
          setDoUneven={setDoUneven}
        />
        <NumPeopleSection.ErrorMessage
          message={errorMessage}
          nameOfClass="expense-form-error"
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
          doUneven={doUneven}
          amount={amount}
          unevenSplitAmounts={unevenSplitAmounts}
          setUnevenSplitAmounts={setUnevenSplitAmounts}
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
      </Row> */}
    </div>
  )
}

export default ExpenseSection
