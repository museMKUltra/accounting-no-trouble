import React from 'react'
import { useCustomFields } from '../../hooks/asana/useCustomFields.js'
import CheckboxList from '../CheckboxList.js'

function ProjectCustomField({
	projectGid,
	checkedCheckboxes,
	checkCheckbox,
	uncheckCheckbox,
}) {
	const { isFetching, customFields } = useCustomFields({ projectGid })
	const checkboxList = customFields.map(customField =>
		Object.assign(customField, { key: customField.gid })
	)

	return (
		<>
			{isFetching ? (
				<p>fetching...</p>
			) : (
				<CheckboxList
					checkboxList={checkboxList}
					checkedCheckboxes={checkedCheckboxes}
					checkCheckbox={checkCheckbox}
					uncheckCheckbox={uncheckCheckbox}
				/>
			)}
		</>
	)
}

export default ProjectCustomField
