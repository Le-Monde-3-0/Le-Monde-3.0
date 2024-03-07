import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, AlertIcon, HStack, Input, Switch, Text, VStack } from '@chakra-ui/react';

import { useIpfsContext } from 'contexts/ipfs';
import { useAuthContext } from 'contexts/auth';

const IpfsConfig = (): JSX.Element => {
	const { auth, toggleOfflineState } = useAuthContext();
	const { config, setGateway, getIPFSFile } = useIpfsContext();
	const [isGatewayWorking, setIsGatewayWorking] = useState<true | false | 'loading'>(false);

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

	useEffect(() => {
		testGateway();
	}, [config.gateway]);

	useEffect(() => {
		if (config.gateway === undefined) {
			setGateway('http://localhost:8080');
		}
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
						value={config.gateway}
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
			</VStack>
		</>
	);
};
export default IpfsConfig;
