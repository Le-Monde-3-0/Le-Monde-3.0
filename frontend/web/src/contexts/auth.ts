import { createContext, useContext } from 'react';

type AuthContextType = {
	auth: {
		accessToken: string | undefined;
	};
	clearAuth: () => void;
	setAccessToken: (accessToken: string) => void;
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
