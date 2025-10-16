import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

const Ctx = createContext(null)

export function Tabs({ defaultValue, value, onValueChange, children, className='' }) {
  const [val, setVal] = useState(value ?? defaultValue)
  useEffect(()=>{ if (value !== undefined) setVal(value) }, [value])
  const api = useMemo(()=>({
    value: val,
    set: v => {
      if (onValueChange) onValueChange(v)
      if (value === undefined) setVal(v)
    }
  }), [val, onValueChange, value])
  return <Ctx.Provider value={api}><div className={className}>{children}</div></Ctx.Provider>
}

export function TabsList({ children, className='' }) {
  return <div className={`inline-grid gap-2 bg-gray-100 rounded-xl p-1 ${className}`}>{children}</div>
}

export function TabsTrigger({ value, children, className='' }) {
  const api = useContext(Ctx)
  const active = api?.value === value
  return (
    <button
      type="button"
      onClick={()=>api?.set(value)}
      className={`px-3 py-1.5 text-sm rounded-lg ${active?'bg-white shadow':'text-gray-600 hover:bg-white/60' } ${className}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }) {
  const api = useContext(Ctx)
  if (api?.value !== value) return null
  return <div>{children}</div>
}
