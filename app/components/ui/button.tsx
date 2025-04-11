import React, { ReactNode } from 'react'

interface ButtonProps {
  children: any
  variant?: 'default' | 'ghost'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ 
  children, 
  variant = 'default', 
  className = '',
  onClick,
  disabled = false,
  type = 'submit'
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md transition-colors'
  const variantStyles = {
    default: 'bg-primary text-white hover:bg-primary/90',
    ghost: 'hover:bg-gray-100'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
} 