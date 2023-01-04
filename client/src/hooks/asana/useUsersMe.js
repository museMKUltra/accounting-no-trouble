import { useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useUsersMe() {
	const [workspaces, setWorkspaces] = useState([])
	const [meGid, setMeGid] = useState('')
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	async function fetchUsersMe() {
		try {
			setIsFetching(true)
			const { gid = '', workspaces = [] } = await client.users.me()

			setMeGid(gid)
			setWorkspaces(workspaces)
		} catch (e) {
			console.error(e)
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		if (!client) return

		fetchUsersMe()
	}, [client])

	return { isFetching, meGid, workspaces }
}
