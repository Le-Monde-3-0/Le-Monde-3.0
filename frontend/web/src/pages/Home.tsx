import * as React from 'react';
import { Button, Link, Text } from '@chakra-ui/react';
import { Link as RouteLink, useNavigate } from 'react-router-dom';

import { useUserContext } from 'contexts/user';

const Home = (): JSX.Element => {
	const navigate = useNavigate();
	const { data, methods } = useUserContext();

	const enterOfflineMode = async () => {
		if (!data.isOffline) methods.toggleIsOfflineState();
		navigate('/reglages');
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
				Utilisez Anthologia <b>hors-ligne</b> pour lire dans un État censuré.
			</Text>
			<Button onClick={enterOfflineMode} variant="primary-purple">
				Mode hors ligne
			</Button>
		</>
	);
};

export default Home;
