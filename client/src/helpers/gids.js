import { PROJECT, CUSTOM_FIELD } from '../configs/constent.js'

export const getCustomFieldGids = projectGid => {
	const hasProject = Object.keys(PROJECT).some(
		projectKey => PROJECT[projectKey].GID === projectGid
	)

	if (!hasProject) {
		console.warn(`config constant has no project gid ${projectGid}`)
		return []
	}

	const customFieldKeys = Object.keys(CUSTOM_FIELD).filter(
		customFieldKey => CUSTOM_FIELD[customFieldKey].PROJECT.GID === projectGid
	)

	return customFieldKeys.map(customFieldKey => CUSTOM_FIELD[customFieldKey].GID)
}
