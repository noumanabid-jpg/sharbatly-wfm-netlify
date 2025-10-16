import React from 'react'
export function Badge({ children, className='', variant='secondary' }) {
  const cls = variant==='secondary' ? 'bg-gray-100 text-gray-800' : 'bg-black text-white'
  return <span className={`inline-block text-xs px-2 py-1 rounded-2xl ${cls} ${className}`}>{children}</span>
}
