import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AuthLayout from 'layouts/Auth';
import { useUIContext } from 'contexts/ui';
import { useOnlineUserContext } from 'contexts/onlineUser';

const Auth = (): JSX.Element => {
	const navigate = useNavigate();
	const { methods } = useOnlineUserContext();
	const { handleToast } = useUIContext();

	// TODO: in UI context ?
	const uiSignAgain = async () => {
		try {
			const res = await methods.auth.sign.again();
			handleToast(res, false, false, true);
			if (res.status === 'success') {
				navigate('/favoris');
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiSignAgain();
	}, []);

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
};

export default Auth;
