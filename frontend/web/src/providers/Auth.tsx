import React, { useEffect, useState } from 'react';

import AuthContext, { AuthContextType } from 'contexts/auth';
import services from 'services';
import handleRequest from 'utils/handleRequest';

const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const [auth, setAuth] = useState<AuthContextType['auth']>({
		accessToken: undefined,
	});

	useEffect(() => {
		const localStorageAuth = localStorage.getItem('auth');
		if (localStorageAuth) setAuth(JSON.parse(localStorageAuth));
	}, []);

	useEffect(() => {
		if (auth && auth.accessToken) {
			localStorage.setItem('auth', JSON.stringify(auth));
		}
	}, [auth]);

	const authContextValue: AuthContextType = {
		auth,
		clearAuth: () => {
			localStorage.removeItem('auth');
			setAuth({
				accessToken: undefined,
			});
		},
		setAccessToken: (accessToken: string) => setAuth((a) => ({ ...a, accessToken })),
		login: async ({ email, password }: { email: string; password: string }) =>
			handleRequest({
				request: async () => {
					const res = await services.auth.login({ email, password });
					authContextValue.setAccessToken(res.data.token);
					return res;
				},
				requestName: 'login',
			}),
		register: ({ email, username, password }: { email: string; username: string; password: string }) =>
			handleRequest({
				request: async () => await services.auth.register({ email, username, password }),
				requestName: 'register',
			}),
	};

	return <AuthContext.Provider value={authContextValue} children={children} />;
};

export default AuthProvider;
