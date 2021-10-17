import React from 'react'

const UnevenAmounts = ({ names, payees, unevenAmounts, setUnevenAmounts }) => {
  const handleAmountEntry = (e, i) => {
    const numEntered = Number(e.target.value)
    if (isNaN(numEntered) && e.target.value !== '.') return
    if (numEntered < 0) return

    setUnevenAmounts(
      unevenAmounts.map((a, idx) => (
        idx === i ? e.target.value : a
      ))
    )
  }

  return (
    <div className="uneven-amounts">
      <div className="section-title">
        <div>Amounts</div>
      </div>
      <div className="uneven-amounts-frame custom-scrollbar">
        {names.map((n, i) => {
          if (payees[i]) return (
            <div
              className="uneven-amounts-container"
              key={i}
            >
              <div className="uneven-amount-name">{n}</div>
              <div className="uneven-amount-form">
                <label htmlFor={`uneven-${i}`}>$</label>
                <input
                  id={`uneven-${i}`}
                  value={unevenAmounts[i]}
                  placeholder="0.00"
                  onChange={e => handleAmountEntry(e, i)}
                />
              </div>
            </div>
          ) 
          return null
        })}
      </div>
    </div>
  )
}

const TabulationBoxes = ({ targetAmount, payees, unevenAmounts }) => {
  const roundUpTo2DecimalPlaces = number => Math.ceil(number * 100) / 100

  let convertedTarget = isNaN(Number(targetAmount)) ? 0 : Number(targetAmount)

  let total = unevenAmounts.reduce((total, amt, i) => {
    if (payees[i]) {
      if (isNaN(Number(amt))) return total
      return total + Number(amt)
    }
    return total
  }, 0)

  convertedTarget = roundUpTo2DecimalPlaces(convertedTarget)
  total = roundUpTo2DecimalPlaces(total)

  const left = convertedTarget - total

  return (
    <div className="tabulation-boxes">
      <div className="uneven-target-box">
        <span>TARGET</span>
        <div>
          {`$${convertedTarget.toFixed(2)}`}
        </div>
      </div>
      <div className="uneven-total-box">
        <span>TOTAL</span>
        <div>
          {`$${total.toFixed(2)}`}
        </div>
      </div>
      <div
        className={
          "uneven-left-box" +
          (left === 0
            ? ""
            : left > 0 ? " left-box-positive" : " left-box-negative")
        }
      >
        <span>LEFT</span>
        <div>
          {`$${(convertedTarget - total).toFixed(2)}`}
        </div>
      </div>
    </div>
  )
}

const exportObject = { UnevenAmounts, TabulationBoxes }

export default exportObject
