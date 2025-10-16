import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline', size?: 'sm'|'icon' }
export const Button: React.FC<Props> = ({children, variant='default', size, className, ...props}) => {
  const base='rounded-xl px-3 py-2 text-sm font-medium transition border';
  const v = variant==='outline'? 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50' : 'bg-black text-white border-black hover:opacity-90';
  const s = size==='sm' ? 'text-xs py-1' : size==='icon' ? 'px-2 py-2' : '';
  return <button className={`${base} ${v} ${s} ${className??''}`} {...props}>{children}</button>
}
