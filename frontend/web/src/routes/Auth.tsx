import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

import AuthLayout from 'layouts/Auth';
import { useAuthContext } from 'contexts/auth';

const Auth = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { auth } = useAuthContext();

	useEffect(() => {
		if (auth && auth.accessToken) {
			toast({
				title: 'Bienvenue !',
				description: "Quels articles allez-vous lire ou écrire aujourd'hui ?",
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			navigate('/favoris');
		}
	}, [auth]);

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
};

export default Auth;
