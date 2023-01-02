import React from 'react'
import Checkbox from './Checkbox.js'

function CheckboxList({
	checkedCheckboxes,
	disabledCheckboxes = [],
	checkboxList,
	checkCheckbox,
	uncheckCheckbox,
}) {
	return (
		<ul>
			{checkboxList.map(checkbox => {
				const checked = checkedCheckboxes.includes(checkbox.key)
				const disabled = disabledCheckboxes.includes(checkbox.key)

				return (
					<li key={checkbox.key} style={{ listStyleType: 'none' }}>
						<Checkbox
							checkbox={checkbox}
							checked={checked}
							disabled={disabled}
							checkCheckbox={checkCheckbox}
							uncheckCheckbox={uncheckCheckbox}
						/>
					</li>
				)
			})}
		</ul>
	)
}

export default CheckboxList
