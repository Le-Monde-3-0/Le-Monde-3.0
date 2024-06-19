import { createContext, useContext } from 'react';
import { SignType, EmptyType } from 'types/services';

import { RequestResponse } from 'utils/handleRequest';

type AuthContextType = {
	//
	// Methods to interact with the services
	//
	signUp: ({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}) => Promise<RequestResponse<SignType>>;
	signIn: ({ identifier, password }: { identifier: string; password: string }) => Promise<RequestResponse<SignType>>;
	signOut: () => Promise<RequestResponse<EmptyType>>;
	signAgain: () => Promise<RequestResponse<EmptyType>>;
	updatePassword: ({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string;
		newPassword: string;
	}) => Promise<RequestResponse<SignType>>;
	updateEmail: ({ newEmail }: { newEmail: string }) => Promise<RequestResponse<SignType>>;
	updateUsername: ({ newUsername }: { newUsername: string }) => Promise<RequestResponse<SignType>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthContext = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('Context used outside of provider.');
	return context;
};

export type { AuthContextType };
export { useAuthContext };
export default AuthContext;
