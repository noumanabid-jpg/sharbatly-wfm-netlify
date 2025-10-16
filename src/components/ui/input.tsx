import React from 'react'
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({className, ...props}) => (
  <input className={`rounded-xl border border-gray-300 px-3 py-2 text-sm ${className??''}`} {...props}/>
)
