import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { Button, Input, Link } from '@chakra-ui/react';

import services from 'services';
import PwdInput from 'components/PwdInput';

const Connexion = (): JSX.Element => {
	const navigate = useNavigate();
	const [login, setLogin] = useState('');
	const [pwd, setPwd] = useState('');
	const [validation, setValidation] = useState(false);

	const connexion = async () => {
		try {
			const res = await services.authService.login({ email: 'a@a.com', password: 'aaa' });
			console.log(res);
			navigate('/favoris');
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const loginValidation = login.length >= 1;
		const pwdValidation = pwd.length >= 1;
		const globalValidation = loginValidation && pwdValidation;

		setValidation(globalValidation);
	}, [login, pwd]);

	return (
		<>
			<Input
				id="connexion-email-input"
				variant="primary-1"
				placeholder="e-mail ou nom d'utilisateur"
				onChange={(e) => setLogin(e.target.value)}
			/>
			<PwdInput
				inputId="connexion-pwd-input"
				variant="primary-1"
				placeholder="mot de passe"
				onChange={(e) => setPwd(e.target.value)}
			/>
			<Button id="connexion-connexion-btn" variant="primary-1" isDisabled={!validation} onClick={connexion}>
				Connexion
			</Button>
			<Link as={RouteLink} to="/inscription" w="100%">
				<Button id="connexion-inscription-btn" variant="secondary-4">
					Inscription
				</Button>
			</Link>
		</>
	);
};

export default Connexion;
