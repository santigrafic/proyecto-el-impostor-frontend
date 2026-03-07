import React, { useCallback, useState } from "react"

const Button: React.FC<any> = ({ updateState, count }) => {
    return (
        <button onClick={updateState}>
          count is {count}
        </button>
    )
}

export default Button