import * as React from 'react';
import { useEffect } from 'react';
import { Button, Text } from '@chakra-ui/react';

import { useIpfsContext } from 'contexts/ipfs';

const IpfsConfig = (): JSX.Element => {
	const { config, setGateway, getIPFSFile } = useIpfsContext();

	const testIPFS = async () => {
		console.log('-- TEST IPFS --');
		// const cid = 'QmSMtVRQMHn2zek3UoH2NWfqxk5NKdfHgcSbTbanLif5FU';
		const cid = 'QmP8jTG1m9GSDJLCbeWhVSVgEzCPPwXRdCRuJtQ5Tz9Kc9';
		try {
			const file = await getIPFSFile(cid);
			console.log(file);
		} catch (error) {
			console.error(error);
		}
		console.log('---------------');
	};

	useEffect(() => {
		if (config.gateway === undefined) {
			setGateway('http://localhost:8080');
		}
	}, []);

	return (
		<>
			<Text variant="h5">TODO: /ipfs-config</Text>
			<Button onClick={testIPFS}>Test IPFS</Button>
		</>
	);
};
export default IpfsConfig;
