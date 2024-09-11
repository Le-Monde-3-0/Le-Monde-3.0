import { createContext, useContext } from 'react';

import { User } from 'types/user';

type UserContextType = {
	data: User;
	methods: {
		clear: () => void;
		toggleIsOfflineState: () => void;
	};
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) throw new Error('UserContext used outside of provider.');
	return context;
};

export type { UserContextType };
export { useUserContext };
export default UserContext;
