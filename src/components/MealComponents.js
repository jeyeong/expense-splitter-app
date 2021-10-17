import React from 'react'

const MealItemBox = ({ names, payees, setPayees }) => {
  const changePayeeStatus = (e, i) => {
    e.preventDefault()
    setPayees(payees.map((p, idx) => idx === i ? !p : p))
  }

  return (
    <div className="meal-item-section">
      <div className="section-title">
        <div>Meal item</div>
      </div>
      <div className="meal-item-content">
        <div className="meal-item-amount-box">
          <label>$</label>
          <input/>
        </div>
        <div className="meal-item-payee-frame custom-scrollbar">
          {names.map((n, i) => (
            <div
              className={"meal-item-payee-container"}
              key={i}
            >
              <button
                className={
                  payees[i]
                    ? "meal-item-payee-enabled"
                    : "meal-item-payee-disabled"
                  }
                onClick={e => changePayeeStatus(e, i)}
              >
                <p>{n}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 

const exportObject = { MealItemBox }

export default exportObject
