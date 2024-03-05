import * as React from 'react';
import { useState } from 'react';
import { Button, HStack, Input, Stack, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useUserContext } from 'contexts/user';

const NouvelArticle = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { addArticle } = useUserContext();
	const [title, setTitle] = useState('');
	const [topic, setTopic] = useState('');
	const [content, setContent] = useState('');

	const uiAddPublishedArticle = async () => {
		try {
			const res = await addArticle({ title, topic, content, draft: false });
			toast({
				status: res.status,
				title: res.message,
				description: res.subMessage,
				duration: 5000,
				isClosable: true,
			});
			if (res.status === 'success') {
				navigate(`/articles/${res.data!.Id}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uiAddDraftArticle = async () => {
		try {
			const res = await addArticle({ title, topic, content, draft: true });
			toast({
				status: res.status,
				title: res.message,
				description: res.subMessage,
				duration: 5000,
				isClosable: true,
			});
			if (res.status === 'success') {
				navigate(`/brouillons`);
			}
		} catch (error) {
			console.log(error);
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
					onChange={(e) => setTopic(e.target.value)}
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
				onClick={() => uiAddPublishedArticle()}
				isDisabled={title === '' || topic === '' || content === ''}
			>
				Publier
			</Button>
			<Stack w="100%" direction={{ base: 'column', md: 'row' }}>
				<Button id="nouvel-article-pre-visualize-btn" variant="primary-blue" isDisabled>
					Pré-visualisez votre article
				</Button>
				<Button
					id="nouvel-article-save-draft-btn"
					variant="primary-purple"
					onClick={() => uiAddDraftArticle()}
					isDisabled={title === '' || topic === '' || content === ''}
				>
					Enregistrer dans les brouillons
				</Button>
			</Stack>
		</VStack>
	);
};

export default NouvelArticle;
