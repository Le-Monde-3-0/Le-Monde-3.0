import * as React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { VStack, CircularProgress } from '@chakra-ui/react';

import PrivateLayout from 'layouts/Private';
import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { useAuthContext } from 'contexts/auth';

const Private = (): JSX.Element => {
	const auth = useAuthContext();
	const { data, methods } = useUserContext();
	const { handleToast } = useUIContext();

	const uiMe = async () => {
		try {
			const res = await auth.methods.me();
			handleToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiLoadWrittenArticles = async () => {
		try {
			const res = await methods.articles.load.written();
			handleToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiLoadLikedArticles = async () => {
		try {
			const res = await methods.articles.load.liked();
			handleToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiLoadAnthologies = async () => {
		try {
			const res = await methods.anthologies.load();
			handleToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiMe();
		uiLoadWrittenArticles();
		uiLoadLikedArticles();
		uiLoadAnthologies();
	}, []);

	if (!data.user.articles.written || !data.user.articles.liked || !data.user.anthologies) {
		return (
			<VStack w="100%" h="100vh" justify="center">
				<CircularProgress size="120px" isIndeterminate color="black" />
			</VStack>
		);
	}

	return (
		<PrivateLayout>
			<Outlet />
		</PrivateLayout>
	);
};

export default Private;
