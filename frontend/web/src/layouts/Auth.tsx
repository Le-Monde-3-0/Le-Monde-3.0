import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Image, Stack, Text, VStack } from '@chakra-ui/react';
import HomeIcon from 'theme/illustrations/home-yellow.svg';
import LoginIcon from 'theme/illustrations/login-yellow.svg';
import RegisterIcon from 'theme/illustrations/register-yellow.svg';

type AuthProps = { children: JSX.Element };

const Auth = ({ children }: AuthProps): JSX.Element => {
	const location = useLocation();
	const [path, setPath] = useState('');

	useEffect(() => {
		setPath(location.pathname);
	}, [location]);

	return (
		<Stack
			direction={{ base: 'column', xl: 'row-reverse' }}
			alignItems="center"
			justifyContent="space-evenly"
			minH="100vh"
			p={{ base: '8px', lg: '48px' }}
		>
			<Image
				src={path === '/' ? HomeIcon : path === '/inscription' ? LoginIcon : RegisterIcon}
				w="100%"
				maxW={{ base: '240px', md: '320px', lg: '400px' }}
				maxH={{ base: '240px', md: '320px', lg: '400px' }}
			/>
			<VStack spacing="56px">
				<VStack spacing="0px">
					<Text id="app-title" variant="h1" textAlign="center">
						Le Monde 3.0
					</Text>
					<Text id="app-description" variant="p" textAlign="center">
						Le journal décentralisé luttant contre la censure. (version BETA)
					</Text>
				</VStack>
				<VStack w="100%" maxW="496px">
					{children}
				</VStack>
			</VStack>
		</Stack>
	);
};

export default Auth;
