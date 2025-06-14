import React from 'react'

export default function progress({current}) {
  return (
    <ul className="steps gap-4">
        <li className="step step-primary"></li>
        <li className={current === 1 || current === 2 ? `step step-primary` : 'step'}></li>
        <li className={current === 2 ? `step step-primary` : 'step'}></li>
    </ul>
  )
}
