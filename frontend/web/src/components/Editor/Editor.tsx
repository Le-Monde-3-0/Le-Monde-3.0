import * as React from 'react';
import { useState } from 'react';
import { Button, HStack, Input, Stack, Textarea, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';

const Editor = ({
	placeholderTitle,
	placeholderTopic,
	placeholderContent,
}: {
	placeholderTitle: string;
	placeholderTopic: string;
	placeholderContent: string;
}): JSX.Element => {
	const navigate = useNavigate();
	const { addArticle } = useUserContext();
	const { requestResponseToast } = useUIContext();
	const [title, setTitle] = useState(placeholderTitle);
	const [topic, setTopic] = useState(placeholderTopic);
	const [content, setContent] = useState(placeholderContent);

	const uiAddPublishedArticle = async () => {
		try {
			const res = await addArticle({ title, topic, content, draft: false });
			requestResponseToast(res, true);
			if (res.status === 'success') {
				navigate(`/articles/${res.data!.Id}`);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiAddDraftArticle = async () => {
		try {
			const res = await addArticle({ title, topic, content, draft: true });
			requestResponseToast(res, true);
			if (res.status === 'success') {
				navigate(`/brouillons`);
			}
		} catch (error) {
			console.error(error);
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
					value={title}
				/>
				<Input
					w="25%"
					id="nouvel-article-topic-input"
					variant="primary-1"
					placeholder="Sujet du nouvel article"
					onChange={(e) => setTopic(e.target.value)}
					value={topic}
				/>
			</HStack>
			<Textarea
				id="nouvel-article-content-textarea"
				variant="primary-1"
				placeholder="Contenu du nouvel article"
				flexGrow="2"
				minH="240px"
				onChange={(e) => setContent(e.target.value)}
				value={content}
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

export default Editor;
