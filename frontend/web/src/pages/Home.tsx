import * as React from 'react';
import { Button, Link, Text } from '@chakra-ui/react';
import { Link as RouteLink, useNavigate } from 'react-router-dom';

import { useUserContext } from 'contexts/user';

const Home = (): JSX.Element => {
	const navigate = useNavigate();
	const { toggleIsOfflineState } = useUserContext();

	const enterOfflineMode = async () => {
		toggleIsOfflineState();
		navigate('/ipfs-config');
	};

	return (
		<>
			<Text>
				Utilisez Le Monde 3.0 <b>en ligne</b> pour publier des articles.
			</Text>
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
			<br />
			<Text>
				Utilisez Le Monde 3.0 <b>hors ligne</b> pour lire dans un État censuré.
			</Text>
			<Button onClick={enterOfflineMode} variant="primary-purple">
				Mode hors ligne
			</Button>
		</>
	);
};

export default Home;
