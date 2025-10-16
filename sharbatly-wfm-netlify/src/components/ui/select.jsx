import React, { useMemo } from 'react'

export function Select({ value, onValueChange, children }) {
  // Flatten children to find SelectItem options
  const items = []
  React.Children.forEach(children, child => {
    if (child && child.props && child.props.children) {
      React.Children.forEach(child.props.children, sub => {
        if (sub && sub.type && sub.type.displayName === 'SelectItem') {
          items.push({ value: sub.props.value, label: sub.props.children })
        }
      })
    }
  })
  return (
    <select
      className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm"
      value={value}
      onChange={e=>onValueChange && onValueChange(e.target.value)}
    >
      {items.map(it => <option key={it.value} value={it.value}>{it.label}</option>)}
    </select>
  )
}

export function SelectTrigger({ children }) { return <>{children}</> }
export function SelectValue() { return null }
export function SelectContent({ children }) { return <>{children}</> }
export function SelectItem({ value, children }) { return null }
SelectItem.displayName = 'SelectItem'
