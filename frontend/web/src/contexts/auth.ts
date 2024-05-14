import { createContext, useContext } from 'react';
import { LoginType, EmptyType, MeType } from 'types/services';

import { RequestResponse } from 'utils/handleRequest';

type AuthContextType = {
	//
	// Data stored
	//
	auth: {
		accessToken: string | undefined;
		offline: boolean;
		id: number;
		email: string;
		username: string;
		isPrivate: boolean;
	};

	//
	// Methods to manipulate data stored
	//
	clearAuth: () => void;
	setAccessToken: (accessToken: string) => void;
	toggleOfflineState: () => void;
	setId: (id: number) => void;
	setEmail: (email: string) => void;
	setUsername: (username: string) => void;
	toggleIsPrivateState: () => void;

	//
	// Methods to interact with the services
	//
	login: ({ identifier, password }: { identifier: string; password: string }) => Promise<RequestResponse<LoginType>>;
	register: ({
		email,
		username,
		password,
	}: {
		email: string;
		username: string;
		password: string;
	}) => Promise<RequestResponse<EmptyType>>;
	me: () => Promise<RequestResponse<MeType>>;
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
