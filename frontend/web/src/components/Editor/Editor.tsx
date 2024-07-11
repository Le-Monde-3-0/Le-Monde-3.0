import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, HStack, Input, Select, Stack, Textarea, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import { Topic } from 'types/topic';

const Editor = (): JSX.Element => {
	const navigate = useNavigate();
	const { handleToast } = useUIContext();
	const { methods } = useUserContext();
	const [topics, setTopics] = useState<Topic[]>([]);
	const [title, setTitle] = useState('');
	const [topic, setTopic] = useState('');
	const [content, setContent] = useState('');

	const uiSearchAllTopics = async () => {
		try {
			const res = await methods.topics.search.all();
			handleToast(res);
			if (res.status === 'success') setTopics(res.data!);
		} catch (error) {
			console.error(error);
		}
	};

	const uiCreateArticle = async (draft: boolean) => {
		try {
			const res = await methods.articles.create({
				title,
				content,
				topic: topics.find((t) => t.name === topic)!.id,
				draft,
			});
			handleToast(res, true);
			if (res.status === 'success') {
				if (!draft) {
					navigate(`/articles/${res.data!.id}`);
				} else {
					navigate(`/brouillons`);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiSearchAllTopics();
	}, []);

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
				<Select
					w="25%"
					id="nouvel-article-topic-input"
					variant="primary-1"
					onChange={(e) => setTopic(e.target.value)}
					value={topic}
					sx={{
						'> option': {
							background: '#212529',
						},
					}}
				>
					{topics.map((t, index) => (
						<option key={index}>{t.name}</option>
					))}
				</Select>
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
				onClick={() => uiCreateArticle(false)}
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
					onClick={() => uiCreateArticle(true)}
					isDisabled={title === '' || topic === '' || content === ''}
				>
					Enregistrer dans les brouillons
				</Button>
			</Stack>
		</VStack>
	);
};

export default Editor;
