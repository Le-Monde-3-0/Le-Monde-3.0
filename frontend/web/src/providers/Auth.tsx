import React, { useEffect, useState } from 'react';

import AuthContext, { AuthContextType } from 'contexts/auth';

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
		clearAuth: () =>
			setAuth({
				accessToken: undefined,
			}),
		setAccessToken: (accessToken: string) => setAuth((a) => ({ ...a, accessToken })),
	};

	return <AuthContext.Provider value={authContextValue} children={children} />;
};

export default AuthProvider;
