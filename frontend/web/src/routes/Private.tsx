import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

import UserProvider from 'providers/User';
import PrivateLayout from 'layouts/Private';
import { useAuthContext } from 'contexts/auth';

const Private = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { auth } = useAuthContext();

	useEffect(() => {
		if ((!localStorage.getItem('auth') || !auth || !auth.accessToken) && !auth.offline) {
			toast({
				title: "Vous n'êtes pas authentifié.",
				description: "Nous vous avons redirigé automatiquement vers la page d'acceuil.",
				status: 'error',
				duration: 9000,
				isClosable: true,
			});
			navigate('/');
		}
	}, [auth]);

	return (
		<UserProvider>
			<PrivateLayout>
				<Outlet />
			</PrivateLayout>
		</UserProvider>
	);
};

export default Private;
