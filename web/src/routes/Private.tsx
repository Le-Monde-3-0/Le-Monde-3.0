import * as React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import PrivateLayout from 'layouts/Private';
import { useUIContext } from 'contexts/ui';
import { useOnlineUserContext } from 'contexts/onlineUser';
import { useUserContext } from 'contexts/user';

const Private = (): JSX.Element => {
	const user = useUserContext();
	const { methods } = useOnlineUserContext();
	const { handleToast } = useUIContext();

	// TODO: in UI context ?
	const uiMe = async () => {
		try {
			const res = await methods.auth.me();
			handleToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!user.data.isOffline) {
			console.log(user);
			uiMe();
		}
	}, []);

	return (
		<PrivateLayout>
			<Outlet />
		</PrivateLayout>
	);
};

export default Private;
