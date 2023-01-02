import React from 'react'

function Button({ handleClick, children, disabled }) {
	return (
		<button
			style={{ cursor: disabled ? 'default' : 'pointer' }}
			disabled={disabled}
			type="button"
			onClick={handleClick}
		>
			{children}
		</button>
	)
}

export default Button
