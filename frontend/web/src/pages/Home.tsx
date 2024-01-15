import * as React from 'react';
import { Button, Link } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';

const Home = (): JSX.Element => (
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
	</>
);

export default Home;
