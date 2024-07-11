import React, { useEffect, useState } from 'react';

import AuthContext, { AuthContextType } from 'contexts/auth';
import { Auth } from 'types/auth';
import { AuthUpdateEmail, AuthUpdateUsername } from 'types/services';
import actions from './actions';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';

const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const defaultAuthData = {
		id: 0,
		createdAt: new Date(),
		email: '',
		username: '',
	};

	const [authData, setAuthData] = useState<Auth>(loadFromLocalStorage<Auth>('auth', defaultAuthData));

	const data = {
		updateAll: (newData: Auth) => setAuthData(newData),
		updateEmail: (newEmail: string) => setAuthData((a) => ({ ...a, email: newEmail })),
		updateUsername: (newUsername: string) => setAuthData((a) => ({ ...a, username: newUsername })),
	};

	useEffect(() => {
		const localStorageAuth = localStorage.getItem('auth');
		if (localStorageAuth) setAuthData(JSON.parse(localStorageAuth));
	}, []);

	useEffect(() => {
		if (authData) {
			localStorage.setItem('auth', JSON.stringify(authData));
		}
	}, [authData]);

	const authContextValue: AuthContextType = {
		data: authData,
		methods: {
			sign: {
				up: actions.sign.up,
				in: actions.sign.in,
				out: actions.sign.out,
				again: actions.sign.again,
			},
			me: () => actions.me({ callback: data.updateAll }),
			update: {
				password: actions.update.password,
				email: (params: AuthUpdateEmail) => actions.update.email({ callback: data.updateEmail, params }),
				username: (params: AuthUpdateUsername) => actions.update.username({ callback: data.updateUsername, params }),
			},
		},
	};

	return <AuthContext.Provider value={authContextValue} children={children} />;
};

export default AuthProvider;
