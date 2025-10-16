import React from 'react'
type Props = { checked:boolean, onCheckedChange:(v:boolean)=>void }
export const Switch: React.FC<Props> = ({checked,onCheckedChange}) => (
  <label style={{display:'inline-flex',alignItems:'center',gap:6,cursor:'pointer'}}>
    <input type='checkbox' checked={checked} onChange={e=>onCheckedChange(e.target.checked)} />
    <span>{checked?'On':'Off'}</span>
  </label>
)
