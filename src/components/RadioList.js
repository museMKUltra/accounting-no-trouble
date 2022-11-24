import React from 'react'

function RadioList({ inputName, currentRadio, radioList, updateCurrentRadio }) {
	return (
		<ul>
			{radioList.map(radio => (
				<li key={radio.key} style={{ listStyleType: 'none' }}>
					<input
						name={inputName}
						type="radio"
						value={radio.key}
						id={radio.key}
						checked={currentRadio === radio.key}
						onChange={() => updateCurrentRadio(radio.key)}
					/>
					<label htmlFor={radio.key}>{radio.name}</label>
				</li>
			))}
		</ul>
	)
}

export default RadioList
