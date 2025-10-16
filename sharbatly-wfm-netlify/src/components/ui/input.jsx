import React from 'react'
export function Input({ className='', ...props }) {
  return <input className={`border border-gray-300 rounded-xl px-3 h-10 text-sm ${className}`} {...props} />
}
