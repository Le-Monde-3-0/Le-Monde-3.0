import React, { useEffect, useState } from 'react';

import AuthContext, { AuthContextType } from 'contexts/auth';
import services from 'services';
import handleRequest from 'utils/handleRequest';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const defaultAuth = {
		accessToken: undefined,
		offline: false,
		id: -1,
		email: '',
		username: '',
		isPrivate: true,
	};

	const [auth, setAuth] = useState<AuthContextType['auth']>(
		loadFromLocalStorage<AuthContextType['auth']>('auth', defaultAuth),
	);

	useEffect(() => {
		const localStorageAuth = localStorage.getItem('auth');
		if (localStorageAuth) setAuth(JSON.parse(localStorageAuth));
	}, []);

	useEffect(() => {
		if (auth) {
			localStorage.setItem('auth', JSON.stringify(auth));
		}
	}, [auth]);

	const authContextValue: AuthContextType = {
		auth,

		clearAuth: () => {
			localStorage.removeItem('auth');
			setAuth(defaultAuth);
		},
		setAccessToken: (accessToken: string) => setAuth((a) => ({ ...a, accessToken })),
		toggleOfflineState: () => setAuth((a) => ({ ...a, offline: !a.offline })),
		setId: (id: number) => setAuth((a) => ({ ...a, id })),
		setEmail: (email: string) => setAuth((a) => ({ ...a, email })),
		setUsername: (username: string) => setAuth((a) => ({ ...a, username })),
		toggleIsPrivateState: () => setAuth((a) => ({ ...a, isPrivate: !a.isPrivate })),

		login: async ({ identifier, password }: { identifier: string; password: string }) =>
			handleRequest({
				request: async () => {
					const loginRes = await services.auth.login({ identifier, password });
					authContextValue.setAccessToken(loginRes.data.token);
					return loginRes;
				},
				name: 'login',
			}),
		me: async () =>
			handleRequest({
				request: async () => {
					const meRes = await services.auth.me({ token: auth.accessToken! });
					authContextValue.setId(meRes.data.Id);
					authContextValue.setEmail(meRes.data.Email);
					authContextValue.setUsername(meRes.data.Username);
					if (auth.isPrivate !== meRes.data.IsPrivate) authContextValue.toggleIsPrivateState();
					return meRes;
				},
				name: 'me',
			}),
		register: ({ email, username, password }: { email: string; username: string; password: string }) =>
			handleRequest({
				request: async () => await services.auth.register({ email, username, password }),
				name: 'register',
			}),
	};

	return <AuthContext.Provider value={authContextValue} children={children} />;
};

export default AuthProvider;
