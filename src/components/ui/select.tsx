import React from 'react'
type Item = { value:string, label:string }
type SelectProps = { value:string, onValueChange:(v:string)=>void, children:React.ReactNode }
const ItemsCtx = React.createContext<{items:Item[], setItems:(x:Item[])=>void} | null>(null)
export const Select: React.FC<SelectProps> = ({value,onValueChange,children}) => {
  const [items,setItems] = React.useState<Item[]>([])
  return <ItemsCtx.Provider value={{items,setItems}}>
    <div style={{display:'inline-block', minWidth:180}}>
      <select value={value} onChange={e=>onValueChange(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:12, border:'1px solid #ddd'}}>
        {items.map(it=><option key={it.value} value={it.value}>{it.label}</option>)}
      </select>
      <div style={{display:'none'}}>{children}</div>
    </div>
  </ItemsCtx.Provider>
}
export const SelectTrigger: React.FC<{children?:React.ReactNode}> = ({children}) => <>{children}</>
export const SelectValue: React.FC<{placeholder?:string}> = ()=> null
export const SelectContent: React.FC<{children:React.ReactNode}> = ({children}) => <>{children}</>
export const SelectItem: React.FC<{value:string, children:React.ReactNode}> = ({value, children}) => {
  const ctx = React.useContext(ItemsCtx)
  React.useEffect(()=>{
    if(ctx) ctx.setItems(prev=> prev.some(i=>i.value===value)? prev : [...prev,{value, label:String(children)}])
  },[value, children])
  return null
}
