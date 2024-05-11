import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, AlertIcon, Button, HStack, Input, Switch, Text, VStack } from '@chakra-ui/react';

import { useIpfsContext } from 'contexts/ipfs';
import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';

const IpfsConfig = (): JSX.Element => {
	const { user } = useUserContext();
	const { auth, toggleOfflineState } = useAuthContext();
	const { ipfs, setArticles, setGateway, getIPFSFile } = useIpfsContext();
	const [isGatewayWorking, setIsGatewayWorking] = useState<true | false | 'loading'>(false);
	const [isRefreshWorking, setIsRefreshWorking] = useState<true | false | 'loading'>(false);

	const testGateway = async () => {
		const cid = 'Qmf8e9tCBH62GNKwYc6jypzqf5hcP5L61SMdZVBVFiqSip';
		try {
			setIsGatewayWorking('loading');
			const file = await getIPFSFile<{ message: string }>(cid);
			setIsGatewayWorking(file.message === 'OK');
			console.log(file);
		} catch (error) {
			setIsGatewayWorking(false);
			console.error(error);
		}
	};

	const refresh = async () => {
		// const cid = 'Qmf8e9tCBH62GNKwYc6jypzqf5hcP5L61SMdZVBVFiqSip';
		try {
			setIsRefreshWorking('loading');
			// const file = await getIPFSFile<{ message: string }>(cid);
			// setIsRefreshWorking(file.message === 'OK');
			// console.log(file);
			setArticles(
				[0, 1, 2, 3, 4, 5].map((i) => ({
					AuthorName: `AuthorName ${i}`,
					Content: `Content ${i}`,
					CreatedAt: new Date(),
					Draft: false,
					Id: i,
					Likes: [],
					TotalViews: i,
					DailyViews: [],
					DailyLikes: [],
					Subtitle: `Subtitle ${i}`,
					Title: `Title ${i}`,
					Topic: `Topic ${i}`,
					UserId: i,
				})),
			);
			setIsRefreshWorking(true);
		} catch (error) {
			setIsRefreshWorking(false);
			console.error(error);
		}
	};

	const downloadProfil = () => {
		const element = document.createElement('a');
		const file = new Blob([JSON.stringify(user, null, '\t')], { type: 'application/json' });
		element.href = URL.createObjectURL(file);
		element.download = 'profil.json';
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	};

	useEffect(() => {
		testGateway();
	}, [ipfs.config.gateway]);

	useEffect(() => {
		if (ipfs.config.gateway === undefined) {
			setGateway('http://localhost:8080');
		}
		testGateway();
		refresh();
	}, []);

	return (
		<>
			<VStack align="start" w="100%" spacing="32px">
				<HStack w="160px" justify="space-between">
					<Text variant="link">{auth.offline ? 'Hors Ligne' : 'En Ligne'}</Text>
					<Switch size="lg" defaultChecked={auth.offline} variant="primary" onChange={toggleOfflineState} />
				</HStack>
				<VStack align="start" w="100%" maxW="560px">
					<Text variant="link">Gateway IPFS</Text>
					<Input
						variant="primary-1"
						placeholder="https://ipfs.io"
						value={ipfs.config.gateway}
						onChange={(e) => setGateway(e.target.value)}
					/>
					<Alert status={isGatewayWorking === 'loading' ? 'info' : isGatewayWorking ? 'success' : 'error'}>
						<AlertIcon />
						{isGatewayWorking === 'loading'
							? 'Vérification en cours'
							: isGatewayWorking
							? 'Gateway fonctionnelle'
							: 'Gateway non-fonctionnelle'}
					</Alert>
				</VStack>
				<VStack align="start" w="100%" maxW="560px">
					<Text variant="link">Rafraîchir les données</Text>
					<Button variant="primary-purple" onClick={refresh}>
						Rafraîchir
					</Button>
					<Alert status={isRefreshWorking === 'loading' ? 'info' : isRefreshWorking ? 'success' : 'error'}>
						<AlertIcon />
						{isRefreshWorking === 'loading'
							? 'Rafraîchissement en cours'
							: isRefreshWorking
							? 'Rafraîchissement réussi'
							: 'Rafraîchissement échoué'}
					</Alert>
				</VStack>
				<VStack>
					<Button variant="primary-yellow" onClick={downloadProfil}>
						Télécharger mon profil
					</Button>
				</VStack>
			</VStack>
		</>
	);
};
export default IpfsConfig;
