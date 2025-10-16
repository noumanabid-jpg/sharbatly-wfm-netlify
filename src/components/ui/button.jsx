import React from 'react'

export function Button({ children, className = '', variant = 'default', size = 'default', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-3 py-2 text-sm shadow-sm transition border'
  const variants = {
    default: 'bg-black text-white border-black hover:opacity-90',
    outline: 'bg-white text-black border-gray-300 hover:bg-gray-50'
  }
  const sizes = {
    default: '',
    icon: 'h-8 w-8 p-0'
  }
  const cls = [base, variants[variant] || variants.default, sizes[size] || '', className].join(' ')
  return <button className={cls} {...props}>{children}</button>
}
