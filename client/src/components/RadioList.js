import React from 'react'

function RadioList({
	inputName,
	currentRadio,
	radioList,
	updateCurrentRadio,
	children,
}) {
	return (
		<ul>
			{radioList.map(radio => {
				const isChecked = currentRadio === radio.key

				return (
					<li key={radio.key} style={{ listStyleType: 'none' }}>
						<input
							name={inputName}
							type="radio"
							value={radio.key}
							id={radio.key}
							checked={isChecked}
							onChange={() => updateCurrentRadio(radio.key)}
						/>
						<label style={{ cursor: 'pointer' }} htmlFor={radio.key}>
							{radio.name}
						</label>
						{isChecked && children}
					</li>
				)
			})}
		</ul>
	)
}

export default RadioList
