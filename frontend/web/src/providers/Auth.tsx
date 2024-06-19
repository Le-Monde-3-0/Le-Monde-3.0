import React from 'react';

import AuthContext, { AuthContextType } from 'contexts/auth';
import services from 'services';
import handleRequest from 'utils/handleRequest';

const AuthProvider = ({ children }: { children: JSX.Element }) => {
	const authContextValue: AuthContextType = {
		signUp: ({ email, username, password }: { email: string; username: string; password: string }) =>
			handleRequest({
				request: async () => await services.auth.signUp({ email, username, password }),
				name: 'signUp',
			}),

		signIn: async ({ identifier, password }: { identifier: string; password: string }) =>
			handleRequest({
				request: async () => await services.auth.signIn({ identifier, password }),
				name: 'signIn',
			}),

		signOut: async () =>
			handleRequest({
				request: async () => await services.auth.signOut(),
				name: 'signOut',
			}),

		signAgain: async () =>
			handleRequest({
				request: async () => await services.auth.refresh(),
				name: 'signAgain',
			}),

		updatePassword: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
			handleRequest({
				request: async () => await services.auth.updatePassword({ oldPassword, newPassword }),
				name: 'updatePassord',
			}),

		updateEmail: ({ newEmail }: { newEmail: string }) =>
			handleRequest({
				request: async () => await services.auth.updateEmail({ newEmail }),
				name: 'updateEmail',
			}),

		updateUsername: ({ newUsername }: { newUsername: string }) =>
			handleRequest({
				request: async () => await services.auth.updateUsername({ newUsername }),
				name: 'updateUsername',
			}),
	};

	return <AuthContext.Provider value={authContextValue} children={children} />;
};

export default AuthProvider;
