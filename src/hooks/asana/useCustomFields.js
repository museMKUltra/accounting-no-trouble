import { client } from '../asana.js'
import { useEffect, useState } from 'react'

export function useCustomFields({ projectGid }) {
	const [customFields, setCustomFields] = useState([])
	const [isFetching, setIsFetching] = useState(false)

	async function fetchCustomFields(project) {
		try {
			setIsFetching(true)
			const { data: customFieldSettings = [] } =
				await client.customFieldSettings.getCustomFieldSettingsForProject(
					project,
					{}
				)

			setCustomFields(
				customFieldSettings.map(
					customFieldSetting => customFieldSetting.custom_field
				)
			)
		} catch (e) {
			console.error(e)
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		if (!projectGid) return

		fetchCustomFields(projectGid)
	}, [projectGid])

	return { isFetching, customFields }
}
