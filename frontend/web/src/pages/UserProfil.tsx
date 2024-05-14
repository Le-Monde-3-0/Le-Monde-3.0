import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Select, Stack, Text, VStack } from '@chakra-ui/react';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import { useUIContext } from 'contexts/ui';
import SearchInput from 'components/Inputs/SearchInput';
import handleRequest from 'utils/handleRequest';

const UserProfil = (): JSX.Element => {
	const { auth } = useAuthContext();
	const { requestResponseToast } = useUIContext();
	const navigate = useNavigate();
	const { userId } = useParams();
	const [search, setSearch] = useState('');

	const getUserProfil = async () => {
		try {
			const profilRes = await handleRequest<{
				id: number;
				email: string;
				username: string;
			}>({
				request: async () => {
					const res = await services.users.get({ token: auth.accessToken!, userId: +userId! });
					return res;
				},
				name: 'getUserProfil',
			});
			requestResponseToast(profilRes);
			if (profilRes.status === 'error') {
				navigate('/favoris');
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getUserProfil();
	}, []);

	return (
		<VStack align="start" w="100%" spacing={{ base: '24px', md: '32px', lg: '40px' }}>
			<VStack w="100%">
				<Text variant="h4">User-{userId}</Text>
				<Stack direction={{ base: 'column', md: 'row' }}>
					<Badge colorScheme="red" variant="solid" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
						0 articles publiés - 0 j'aimes
					</Badge>
					<Badge colorScheme="pink" variant="solid" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
						0 articles aimés
					</Badge>
					<Badge colorScheme="green" variant="solid" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
						0 marque-pages
					</Badge>
				</Stack>
			</VStack>
			<Stack align="start" direction={{ base: 'column', md: 'row' }} w="100%">
				<Select
					variant="primary-1"
					sx={{
						'> option': {
							background: '#212529',
						},
					}}
				>
					<option>Articles publiés</option>
					<option>Articles aimés</option>
					<option>Marque-pages</option>
				</Select>
				<SearchInput
					value={search}
					inputId="brouillons-search-input"
					w="100%"
					placeholder="Cherchez avec un mot clé"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
			</Stack>
		</VStack>
	);
};

export default UserProfil;
