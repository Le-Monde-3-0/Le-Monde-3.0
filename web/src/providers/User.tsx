import React, { useEffect, useState } from 'react';

import UserContext, { UserContextType } from 'contexts/user';
import loadFromLocalStorage from 'utils/loadFromLocalStorage';
import { User } from 'types/user';

const UserProvider = ({ children }: { children: JSX.Element }) => {
	// TODO: verify it's working with onligne mode
	const defaultUser: User = {
		isOffline: false,
	};

	const [user, setUser] = useState<User>(loadFromLocalStorage<User>('user', defaultUser));

	useEffect(() => {
		const localStorageUser = localStorage.getItem('user');
		if (localStorageUser) setUser(JSON.parse(localStorageUser));
	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		}
	}, [user]);

	const UserContextValue: UserContextType = {
		data: user,
		methods: {
			clear: () => {
				localStorage.removeItem('offlineUser');
				setUser(defaultUser);
			},
			toggleIsOfflineState: () => setUser({ isOffline: !user.isOffline }),
		},
	};

	return <UserContext.Provider value={UserContextValue} children={children} />;
};

export default UserProvider;
