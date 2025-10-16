import React from 'react'
type TabsCtx = { value:string, setValue:(v:string)=>void }
const Ctx = React.createContext<TabsCtx|null>(null)

export const Tabs: React.FC<{defaultValue:string, className?:string, value?:string, onValueChange?:(v:string)=>void}> = ({defaultValue, children, className, value:cv, onValueChange}) => {
  const [value,setValue] = React.useState(defaultValue)
  const val = cv ?? value
  const set = (v:string)=> (onValueChange? onValueChange(v): setValue(v))
  return <Ctx.Provider value={{value:val,setValue:set}}><div className={className}>{children}</div></Ctx.Provider>
}
export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, className}) => (
  <div className={`inline-grid gap-2 ${className??''}`}>{children}</div>
)
export const TabsTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { value:string }> = ({value, children, className, ...props}) => {
  const ctx = React.useContext(Ctx)!
  const active = ctx.value===value
  return <button className={`px-3 py-2 rounded-xl border text-sm ${active?'bg-black text-white border-black':'bg-white border-gray-300'}`} onClick={()=>ctx.setValue(value)} {...props}>{children}</button>
}
export const TabsContent: React.FC<React.HTMLAttributes<HTMLDivElement> & {value:string}> = ({value, children}) => {
  const ctx = React.useContext(Ctx)!
  if (ctx.value!==value) return null
  return <div>{children}</div>
}
