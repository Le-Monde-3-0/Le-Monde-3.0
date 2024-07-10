import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AuthLayout from 'layouts/Auth';
import { useUIContext } from 'contexts/ui';
import { useAuthContext } from 'contexts/auth';

const Auth = (): JSX.Element => {
	const navigate = useNavigate();
	const { methods } = useAuthContext();
	const { handleToast } = useUIContext();

	const uiSignAgain = async () => {
		try {
			const res = await methods.sign.again();
			handleToast(res);
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
