import { Button, VStack, Text, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import FormInput from 'components/Inputs/FormInput';
import * as React from 'react';
import { useState } from 'react';

const Reglages = (): JSX.Element => {
	const [password, setPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<Text variant={'h4'}>Réglages</Text>
				<Text variant={'h5'}>Statut</Text>
				<FormControl display={'flex'} alignItems={'center'}>
					  <FormLabel htmlFor='profile-status' mb='0'>
							<Text variant={"h7"}>Profil public</Text>
						</FormLabel>
					<Switch id="status" size="lg" />
				</FormControl>
				<Text variant={'h5'}>Nom d'utilisateur</Text>
				<FormInput
					value={password}
					inputId="password-input"
					w={{ base: '100%', xl: '640px' }}
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
					w={{ base: '100%', xl: '640px' }}
					placeholder="Mot de passe"
					onChange={(e) => setPassword(e.target.value)}
					variant="primary-1"
					isError={false}
					errorMessage=""
				/>
				<FormInput
					value={newPassword}
					inputId="new-password-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Nouveau mot de passe"
					onChange={(e) => setNewPassword(e.target.value)}
					variant="primary-1"
					isError={false}
					errorMessage=""
				/>
				<Button>Modifier</Button>
			</VStack>
		</>
	);
};

export default Reglages;
