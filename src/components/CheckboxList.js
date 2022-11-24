import React from 'react'

function CheckboxList({
	checkedCheckboxes,
	checkboxList,
	checkCheckbox,
	uncheckCheckbox,
}) {
	return (
		<ul>
			{checkboxList.map(checkbox => (
				<li key={checkbox.key} style={{ listStyleType: 'none' }}>
					<input
						type="checkbox"
						value={checkbox.key}
						id={checkbox.key}
						checked={checkedCheckboxes.includes(checkbox.key)}
						onChange={event => {
							if (event.target.checked) {
								checkCheckbox(checkbox.key)
							} else {
								uncheckCheckbox(checkbox.key)
							}
						}}
					/>
					<label htmlFor={checkbox.key}>{checkbox.name}</label>
				</li>
			))}
		</ul>
	)
}

export default CheckboxList
