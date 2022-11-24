import React from 'react'

function Button({ handleClick, children, isDisabled }) {
	return (
		<button disabled={isDisabled} type="button" onClick={handleClick}>
			{children}
		</button>
	)
}

export default Button
