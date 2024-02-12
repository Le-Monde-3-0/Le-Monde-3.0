import * as React from 'react';
import { useEffect } from 'react';
import { Button, Link } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import { useIpfsContext } from 'contexts/ipfs';

const Home = (): JSX.Element => {
	const { config, setGateway, getFile } = useIpfsContext();

	const testIPFS = async () => {
		console.log('-- TEST IPFS --');
		// const cid = 'QmSMtVRQMHn2zek3UoH2NWfqxk5NKdfHgcSbTbanLif5FU';
		const cid = 'QmP8jTG1m9GSDJLCbeWhVSVgEzCPPwXRdCRuJtQ5Tz9Kc9';
		try {
			const file = await getFile(cid);
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
			<Link as={RouteLink} to="/connexion" w="100%">
				<Button id="home-connexion-btn" variant="primary-yellow">
					Connexion
				</Button>
			</Link>
			<Link as={RouteLink} to="/inscription" w="100%">
				<Button id="home-inscription-btn" variant="primary-white">
					Inscription
				</Button>
			</Link>
			<Button onClick={testIPFS} variant="primary-purple">
				Test IPFS
			</Button>
		</>
	);
};

export default Home;
