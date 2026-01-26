import type React from 'react'

import type { IButton } from './utils/interfaces'

const Button: React.FC<IButton> = ({ text, styleClass, handleClick }) => {
  return (
    <button className={styleClass} onClick={handleClick}>{text}</button>
  )
}

export default Button