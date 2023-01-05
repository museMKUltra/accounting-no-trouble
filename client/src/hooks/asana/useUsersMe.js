import { useCallback, useContext, useEffect, useState } from 'react'
import { ClientContext } from '../../contexts/ClientContext.js'

export function useUsersMe() {
	const [workspaces, setWorkspaces] = useState([])
	const [meGid, setMeGid] = useState('')
	const [isFetching, setIsFetching] = useState(false)
	const { client } = useContext(ClientContext)

	const fetchUsersMe = useCallback(async () => {
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
	}, [client])

	useEffect(() => {
		fetchUsersMe()
	}, [])

	return { isFetching, meGid, workspaces }
}
