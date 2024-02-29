import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { Button, Input, Link, useToast } from '@chakra-ui/react';

import { useAuthContext } from 'contexts/auth';
import PwdInput from 'components/Inputs/PwdInput';

const Connexion = (): JSX.Element => {
	const toast = useToast();
	const { login } = useAuthContext();
	const [loginInput, setLoginInput] = useState('');
	const [pwdInut, setPwdInut] = useState('');
	const [validation, setValidation] = useState(false);

	const connexion = async () => {
		try {
			const loginRes = await login({ email: loginInput, password: pwdInut });
			if (loginRes.status !== 'success') {
				toast({
					status: loginRes.status,
					title: loginRes.message,
					description: loginRes.subMessage,
					duration: 5000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const loginValidation = login.length >= 1;
		const pwdValidation = pwdInut.length >= 1;
		const globalValidation = loginValidation && pwdValidation;

		setValidation(globalValidation);
	}, [login, pwdInut]);

	return (
		<>
			<Input
				id="connexion-email-input"
				variant="primary-1"
				placeholder="e-mail ou nom d'utilisateur"
				onChange={(e) => setLoginInput(e.target.value)}
			/>
			<PwdInput
				inputId="connexion-pwd-input"
				variant="primary-1"
				placeholder="mot de passe"
				onChange={(e) => setPwdInut(e.target.value)}
			/>
			<Button id="connexion-connexion-btn" variant="primary-yellow" isDisabled={!validation} onClick={connexion}>
				Connexion
			</Button>
			<Link as={RouteLink} to="/inscription" w="100%">
				<Button id="connexion-inscription-btn" variant="primary-white">
					Inscription
				</Button>
			</Link>
		</>
	);
};

export default Connexion;
