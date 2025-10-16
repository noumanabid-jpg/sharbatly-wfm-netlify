import React from 'react'
export function Slider({ value=[0], min=0, max=100, step=1, onValueChange=()=>{} }) {
  const v = value[0] ?? 0
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={e=>onValueChange([parseInt(e.target.value, 10)])}
      className="w-full"
    />
  )
}
