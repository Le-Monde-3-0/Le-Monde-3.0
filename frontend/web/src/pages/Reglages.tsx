import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Alert,
	AlertIcon,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Stack,
	Switch,
	Text,
	VStack,
	useToast,
} from '@chakra-ui/react';

import { Article } from 'types/article';
import { useIpfsContext } from 'contexts/ipfs';
import { useUserContext } from 'contexts/user';
import { useAuthContext } from 'contexts/auth';
import { useUIContext } from 'contexts/ui';
import FormInput from 'components/Inputs/FormInput';

// TODO: attention déconnexion quand user pas mode hors-ligne

const Reglages = (): JSX.Element => {
	const auth = useAuthContext();
	const user = useUserContext();
	const navigate = useNavigate();
	const { handleToast } = useUIContext();
	const { ipfs, setArticles, setGateway, getIPFSFile } = useIpfsContext();
	const [password, setPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [isGatewayWorking, setIsGatewayWorking] = useState<true | false | 'loading'>(false);
	const [isRefreshWorking, setIsRefreshWorking] = useState<true | false | 'loading'>(false);
	const toast = useToast();

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
		const cid = 'QmdpUHUNR2wwkE1gXb3i7ZA62MjMy9v2ykFM6endBMfFPn';
		try {
			setIsRefreshWorking('loading');
			const file = await getIPFSFile<{ message: string; articles: Article[] }>(cid);
			setIsRefreshWorking(file.message === 'OK');
			console.log(file);
			setArticles(file.articles);
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

	const uploadProfil = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			reader.onload = async (e: any) => {
				try {
					const content = JSON.parse(e.target.result);
					user.methods.user.upload(content);
					toast({
						status: 'success',
						title: 'Profil chargé!',
						duration: 5000,
						isClosable: true,
					});
				} catch (error) {
					console.error(error);
					toast({
						status: 'error',
						title: 'Fichier non valide.',
						description: 'Syntaxe non conforme.',
						duration: 5000,
						isClosable: true,
					});
				}
			};
			reader.readAsText(file);
		}
	};

	const deconnect = async () => {
		try {
			const res = await auth.methods.sign.out();
			handleToast(res, true);
			if (res.status === 'success') {
				navigate('/');
			}
		} catch (error) {
			console.error(error);
		}
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
			<Stack direction={{ base: 'column', lg: 'row' }} spacing="32px" mt="24px">
				<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
					<FormControl display={'flex'} alignItems={'center'}>
						<FormLabel htmlFor="profile-status" mb="0">
							<Text variant={'h7'}>Profil public</Text>
						</FormLabel>
						<Switch id="status" size="lg" />
					</FormControl>
					<Text variant={'h5'}>Nom d'utilisateur</Text>
					<FormInput
						value={password}
						inputId="password-input"
						w="100%"
						placeholder="Nouveau nom d'utilisateur"
						onChange={(e) => setPassword(e.target.value)}
						variant="primary-1"
						isError={false}
						errorMessage=""
					/>
					<Button>Modifier</Button>
					<Text variant={'h5'}></Text>
					<Text variant={'h5'}>Mot de passe</Text>
					<FormInput
						value={password}
						inputId="password-input"
						w="100%"
						placeholder="Mot de passe"
						onChange={(e) => setPassword(e.target.value)}
						variant="primary-1"
						isError={false}
						errorMessage=""
					/>
					<FormInput
						value={newPassword}
						inputId="new-password-input"
						w="100%"
						placeholder="Nouveau mot de passe"
						onChange={(e) => setNewPassword(e.target.value)}
						variant="primary-1"
						isError={false}
						errorMessage=""
					/>
					<Button>Modifier</Button>
					<Button variant="primary-orange" onClick={deconnect}>
						Déconnexion
					</Button>
				</VStack>
				<VStack align="start" w="100%" spacing="32px">
					<HStack w="160px" justify="space-between">
						<Text variant="link">{user.data.user.isOffline ? 'Hors Ligne' : 'En Ligne'}</Text>
						<Switch
							size="lg"
							defaultChecked={user.data.user.isOffline}
							variant="primary"
							onChange={user.methods.user.toggleIsOfflineState}
						/>
					</HStack>
					<VStack align="start" w="100%">
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
					<VStack align="start" w="100%">
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
					<VStack align="start" w="100%" spacing="16px">
						<Button variant="primary-yellow" onClick={downloadProfil}>
							Télécharger mon profil
						</Button>
						<VStack align="start" spacing="8px" w="100%">
							<Text variant="link">Téléverser mon profil</Text>
							<Input h="100%" type="file" variant="file-primary-orange" onChange={uploadProfil} />
						</VStack>
					</VStack>
				</VStack>
			</Stack>
		</>
	);
};

export default Reglages;
