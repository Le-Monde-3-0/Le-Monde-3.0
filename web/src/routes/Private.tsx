import * as React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import PrivateLayout from 'layouts/Private';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';

const Private = (): JSX.Element => {
	const user = useUserContext();
	const ui = useUIContext();

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.user.me();
		}
	}, []);

	return (
		<PrivateLayout>
			<Outlet />
		</PrivateLayout>
	);
};

export default Private;
