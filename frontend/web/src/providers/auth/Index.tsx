import React from 'react';

import AuthContext, { AuthContextType } from 'contexts/auth';
import { again, out, signIn, up } from './sign';
import { email, password, username } from './update';

const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const authContextValue: AuthContextType = {
		methods: {
			sign: {
				up,
				in: signIn,
				out,
				again,
			},
			update: {
				password,
				email,
				username,
			},
		},
	};

	return <AuthContext.Provider value={authContextValue} children={children} />;
};

export default AuthProvider;
