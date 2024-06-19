import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AuthLayout from 'layouts/Auth';
import { useUIContext } from 'contexts/ui';
import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

const Auth = (): JSX.Element => {
	const navigate = useNavigate();
	const { signAgain } = useAuthContext();
	const { searchArticles } = useUserContext();
	const { requestResponseToast } = useUIContext();

	const uiSignAgain = async () => {
		try {
			const res = await signAgain();
			requestResponseToast(res);
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
