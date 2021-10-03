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
        <div key={i}>
          {n}&nbsp;
          $
          <input
            value={unevenSplitAmounts[i]}
            placeholder="0"
            onChange={e => setPayeeAmount(e, i)}
            disabled={!payees[i]}
          />
          <input
            type="checkbox"
            checked={payees[i]}
            onChange={() => changeCheckStatus(i)}
          />
        </div>
      ))}
    </div>
  )
}

const TotalCalculations = ({ target, total }) => {
  return (
    <div className="uneven-totals">
      <div>
        Target {target.toFixed(2)}
      </div>
      <div>
        Total {total.toFixed(2)}
      </div>
      <div>
        Left {(target - total).toFixed(2)}
      </div>
    </div>
  )
}

const UnevenConsole = ({ names, amount, payees, setPayees,
                         unevenSplitAmounts, setUnevenSplitAmounts }) => {
  // Round the target amount up, to 2 decimal places
  const [roundedAmount, setRoundedAmount] = useState(0)

  // Update the rounded amount whenever amount changes
  useEffect(() => {
    setRoundedAmount(
      Math.ceil(Number(amount) * 100) / 100
    )
  }, [amount])

  // Sum of imputed amounts
  const [total, setTotal] = useState(0)

  // Update the sum of imputed amounts whenever the user makes a change
  useEffect(() => {
    setTotal(
      unevenSplitAmounts.reduce((sum, amount, i) => {
        if (payees[i]) return (sum + Number(amount))
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
  )
}

export default UnevenConsole
