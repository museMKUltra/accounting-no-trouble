import React from 'react'

function Checkbox({
	checkbox,
	checked,
	disabled,
	checkCheckbox,
	uncheckCheckbox,
	children,
}) {
	return (
		<>
			{' '}
			<input
				type="checkbox"
				value={checkbox.key}
				id={checkbox.key}
				checked={checked}
				disabled={disabled}
				onChange={event => {
					if (event.target.checked) {
						checkCheckbox(checkbox.key)
					} else {
						uncheckCheckbox(checkbox.key)
					}
				}}
			/>
			<label
				htmlFor={checkbox.key}
				style={{
					color: disabled ? 'lightgray' : 'black',
					cursor: disabled ? 'default' : 'pointer',
				}}
			>
				{checkbox.name}
			</label>
			{children}
		</>
	)
}

export default Checkbox
