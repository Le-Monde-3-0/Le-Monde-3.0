import * as React from 'react';
import { useState } from 'react';
import { Button, HStack, Input, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import { AxiosError } from 'axios';

const NouvelArticle = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { auth } = useAuthContext();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const createArticle = async () => {
		try {
			const res = await services.articles.publish({ token: auth.accessToken!, title, content });
			console.log(res);
			toast({
				title: 'Votre article a été publié !',
				description: 'Nous vous avons redirigé vers votre nouvelle publication.',
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			navigate(`/articles/${res.data.Id}`);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					if (status === 400) {
						toast({
							title: 'Paramètres invalides.',
							description: 'Veuillez en renseigner de nouveaux.',
							status: 'error',
							duration: 9000,
							isClosable: true,
						});
					}
				} else {
					toast({
						title: 'Erreur du service interne.',
						description: 'Veuillez réessayer ultérieurement.',
						status: 'error',
						duration: 9000,
						isClosable: true,
					});
				}
			}
		}
	};

	return (
		<VStack w="100%" h="100vh" py="48px" spacing="16px">
			<HStack w="100%" spacing="16px">
				<Input
					id="nouvel-article-title-input"
					variant="primary-1"
					placeholder="Titre du nouvel article"
					onChange={(e) => setTitle(e.target.value)}
				/>
				<Input
					w="25%"
					id="nouvel-article-topic-input"
					variant="primary-1"
					placeholder="Sujet du nouvel article"
					disabled
				/>
			</HStack>
			<Textarea
				id="nouvel-article-content-textarea"
				variant="primary-1"
				placeholder="Contenu du nouvel article"
				flexGrow="2"
				onChange={(e) => setContent(e.target.value)}
			/>
			<Button id="nouvel-article-publish-btn" variant="primary-1" onClick={() => createArticle()}>
				Publier
			</Button>
			<HStack w="100%" spacing="16px">
				<Button id="nouvel-article-pre-visualize-btn" variant="secondary-4" isDisabled>
					Pré-visualisez votre article
				</Button>
				<Button id="nouvel-article-save-draft-btn" variant="secondary-1" isDisabled>
					Enregistrer dans les brouillons
				</Button>
			</HStack>
		</VStack>
	);
};

export default NouvelArticle;
