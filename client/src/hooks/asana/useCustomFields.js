import { useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useCustomFields({ projectGid }) {
	const [customFields, setCustomFields] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

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
		if (!projectGid || !client) return

		fetchCustomFields(projectGid)
	}, [projectGid, client])

	return { isFetching, customFields }
}
