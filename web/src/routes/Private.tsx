import * as React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import PrivateLayout from 'layouts/Private';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import { useOnlineUserContext } from 'contexts/onlineUser';

const Private = (): JSX.Element => {
	const user = useUserContext();
	const onlineUser = useOnlineUserContext();
	const ui = useUIContext();

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.user.me();
		}
	}, []);

	// TODO: replace with loader
	if (onlineUser.data.id === 0) {
		return <></>;
	}

	return (
		<PrivateLayout>
			<Outlet />
		</PrivateLayout>
	);
};

export default Private;
