import React from 'react'
export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({children,className,...props}) => (
  <span className={`inline-block rounded-xl bg-gray-100 text-gray-700 px-2 py-1 text-xs ${className??''}`} {...props}>{children}</span>
)
