import React, { useState, useEffect } from 'react'

const UnevenNameboxes = ({ names, payees, setPayees,
                           unevenSplitAmounts, setUnevenSplitAmounts }) => {
  const setPayeeAmount = (e, idx) => {
    const numEntered = Number(e.target.value)
    if (isNaN(numEntered) && e.target.value !== '.') return
    if (numEntered < 0) return
    
    const newUnevenSplitAmounts = [...unevenSplitAmounts]
    newUnevenSplitAmounts[idx] = e.target.value
    setUnevenSplitAmounts(newUnevenSplitAmounts)
  }

  const changeCheckStatus = idx => {
    const newPayees = [...payees]
    newPayees[idx] = !newPayees[idx]
    setPayees(newPayees)
  }

  return (
    <div className="uneven-nameboxes">
      {names.map((n, i) => (
        <div
          className={
            payees[i]
            ? "uneven-namebox"
            : "uneven-namebox uneven-namebox-hidden"
          }
          key={i}
        >
          <div className="uneven-namebox-name">{n}</div>
          <div className="uneven-namebox-amount">
            <label htmlFor={`uneven-box-${i}`}>$</label>
            <input
              value={unevenSplitAmounts[i]}
              placeholder="0"
              id = {`uneven-box-${i}`}
              onChange={e => setPayeeAmount(e, i)}
              disabled={!payees[i]}
            />
          </div>
          <input
            type="checkbox"
            className="uneven-namebox-checkbox"
            checked={payees[i]}
            onChange={() => changeCheckStatus(i)}
          />
        </div>
      ))}
    </div>
  )
}

const TotalCalculations = ({ target, total }) => {
  const left = target - total

  return (
    <div className="uneven-totals">
      <div>
        <div className="uneven-totals-title">
          <p>Target</p>
        </div>
        <p className="uneven-totals-figure">${target.toFixed(2)}</p>
      </div>
      <div>
        <div className="uneven-totals-title">
          <p>Total</p>
        </div>
        <p className="uneven-totals-figure">${total.toFixed(2)}</p>
      </div>
      <div>
        <div className="uneven-totals-title">
          <p>Left</p>
        </div>
        <p className={left >= 0 ? "uneven-left-positive" : "uneven-left-negative"}>
          ${(target - total).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

const UnevenConsole = ({ names, amount, payees, setPayees,
                         unevenSplitAmounts, setUnevenSplitAmounts }) => {
  const roundUpTo2DecimalPlaces = number => Math.ceil(number * 100) / 100

  // Round the target amount up, to 2 decimal places
  const [roundedAmount, setRoundedAmount] = useState(0)

  // Update the rounded amount whenever amount changes
  useEffect(() => {
    setRoundedAmount(roundUpTo2DecimalPlaces(Number(amount)))
  }, [amount])

  // Sum of imputed amounts
  const [total, setTotal] = useState(0)

  // Update the sum of imputed amounts whenever the user makes a change
  useEffect(() => {
    setTotal(
      unevenSplitAmounts.reduce((sum, amount, i) => {
        if (amount === ".") return sum
        if (payees[i]) return (sum + roundUpTo2DecimalPlaces(Number(amount)))
        return sum
      }, 0)
    )
  }, [unevenSplitAmounts, payees])

  return (
    <div className="uneven-console uneven-transition">
      <div>
        <div className="uneven-console-title">
          <p>Uneven Splitter</p>
        </div>
        <div className="uneven-console-content">
          <UnevenNameboxes
            names={names}
            payees={payees}
            setPayees={setPayees}
            unevenSplitAmounts={unevenSplitAmounts}
            setUnevenSplitAmounts={setUnevenSplitAmounts}
          />
          <TotalCalculations
            target={roundedAmount}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}

export default UnevenConsole
