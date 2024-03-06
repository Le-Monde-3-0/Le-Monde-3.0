import { createContext, useContext } from 'react';
import { LoginType, EmptyType } from 'types/services';

import { RequestResponse } from 'utils/handleRequest';

type AuthContextType = {
	//
	// Data stored
	//
	auth: {
		accessToken: string | undefined;
		offline: boolean;
	};

	//
	// Methods to manipulate data stored
	//
	clearAuth: () => void;
	setAccessToken: (accessToken: string) => void;
	toggleOfflineState: () => void;

	//
	// Methods to interact with the services
	//
	login: ({ email, password }: { email: string; password: string }) => Promise<RequestResponse<LoginType>>;
	register: ({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}) => Promise<RequestResponse<EmptyType>>;
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
