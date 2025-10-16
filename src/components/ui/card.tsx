import React from 'react'
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, className, ...props}) => (
  <div className={`rounded-xl border border-gray-200 shadow-sm ${className??''}`} {...props}>{children}</div>
)
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, className, ...props}) => (
  <div className={`${className??''}`} {...props}>{children}</div>
)
