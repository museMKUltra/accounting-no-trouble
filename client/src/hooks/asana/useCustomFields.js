import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useCustomFields({ projectGid }) {
	const [customFields, setCustomFields] = useState([])
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchCustomFields = useCallback(
		async project => {
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
		},
		[client]
	)

	useEffect(() => {
		if (!projectGid) return

		fetchCustomFields(projectGid)
	}, [projectGid])

	return { isFetching, customFields }
}
