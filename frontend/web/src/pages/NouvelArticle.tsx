import * as React from 'react';
import { useState } from 'react';
import { Button, HStack, Input, Stack, Textarea, VStack, useToast } from '@chakra-ui/react';
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
		<VStack w="100%" h="100%" spacing="8px">
			<HStack w="100%">
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
				minH="240px"
				onChange={(e) => setContent(e.target.value)}
			/>
			<Button
				id="nouvel-article-publish-btn"
				variant="primary-yellow"
				onClick={() => createArticle()}
				isDisabled={title === '' || content === ''}
			>
				Publier
			</Button>
			<Stack w="100%" direction={{ base: 'column', md: 'row' }}>
				<Button id="nouvel-article-pre-visualize-btn" variant="primary-blue" isDisabled>
					Pré-visualisez votre article
				</Button>
				<Button id="nouvel-article-save-draft-btn" variant="primary-purple" isDisabled>
					Enregistrer dans les brouillons
				</Button>
			</Stack>
		</VStack>
	);
};

export default NouvelArticle;
