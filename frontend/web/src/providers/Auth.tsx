import React, { useEffect, useState } from 'react';

import AuthContext, { AuthContextType } from 'contexts/auth';
import services from 'services';
import handleRequest from 'utils/handleRequest';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const [auth, setAuth] = useState<AuthContextType['auth']>(
		loadFromLocalStorage<AuthContextType['auth']>('auth', {
			accessToken: undefined,
			offline: false,
		}),
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
			setAuth({
				accessToken: undefined,
				offline: false,
			});
		},
		setAccessToken: (accessToken: string) => setAuth((a) => ({ ...a, accessToken })),
		toggleOfflineState: () => setAuth((a) => ({ ...a, offline: !a.offline })),

		login: async ({ identifier, password }: { identifier: string; password: string }) =>
			handleRequest({
				request: async () => {
					const res = await services.auth.login({ identifier, password });
					authContextValue.setAccessToken(res.data.token);
					return res;
				},
				name: 'login',
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
