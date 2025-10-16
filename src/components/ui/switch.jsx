import React from 'react'

export function Switch({ checked=false, onCheckedChange=()=>{}, ...props }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={e=>onCheckedChange(e.target.checked)} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 relative transition">
        <div className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${checked?'translate-x-5':''}`}></div>
      </div>
    </label>
  )
}
