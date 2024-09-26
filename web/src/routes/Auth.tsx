import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AuthLayout from 'layouts/Auth';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';

const Auth = (): JSX.Element => {
	const user = useUserContext();
	const ui = useUIContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.auth.sign.again(() => navigate('/bibliotheque'));
		}
	}, []);

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
};

export default Auth;
