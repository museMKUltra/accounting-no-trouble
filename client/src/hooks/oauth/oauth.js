export function fetchOauthAuthorize() {
	return new Promise((resolve, reject) => {
		fetch('/oauth_authorize')
			.then(response => response.text())
			.then(url => resolve(url))
			.catch(error => reject(error))
	})
}

function fetchOauthToken(body) {
	return new Promise((resolve, reject) => {
		fetch('/oauth_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
			.then(response => response.json())
			.then(
				({
					access_token: accessToken,
					refresh_token: refreshToken,
					data: user,
				}) => {
					resolve({ accessToken, refreshToken, user })
				}
			)
			.catch(error => reject(error))
	})
}

export function fetchOauthTokenByCode(code) {
	return fetchOauthToken({
		code,
		grant_type: 'authorization_code',
	})
}

export function fetchOauthTokenByRefreshToken(refreshToken) {
	return fetchOauthToken({
		refresh_token: refreshToken,
		grant_type: 'refresh_token',
	})
}

export function fetchOauthRevoke(refreshToken) {
	return new Promise((resolve, reject) => {
		fetch('/oauth_revoke', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: refreshToken,
			}),
		})
			.then(() => resolve())
			.catch(error => reject(error))
	})
}
