import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, HStack, Input, Select, Stack, Textarea, VStack } from '@chakra-ui/react';

import { useUIContext } from 'contexts/ui';
import { Topic } from 'types/topic';

const Editor = (): JSX.Element => {
	const navigate = useNavigate();
	const ui = useUIContext();
	const [topics, setTopics] = useState<Topic[]>([]);
	const [title, setTitle] = useState('');
	const [topic, setTopic] = useState('');
	const [content, setContent] = useState('');

	const uiCreateArticle = async (draft: boolean) => {
		await ui.online.articles.create(
			{
				title,
				content,
				topic: topics.find((t) => t.name === topic)!.id,
				draft,
			},
			(id: number) => {
				if (!draft) {
					navigate(`/articles/${id}`);
				} else {
					navigate(`/brouillons`);
				}
			},
		);
	};

	useEffect(() => {
		ui.online.topics.search.all(setTopics);
	}, []);

	return (
		<VStack w="100%" h="100%" spacing="8px">
			<HStack w="100%">
				<Input
					id="write-title-input"
					variant="primary-1"
					placeholder="Titre du nouvel article"
					onChange={(e) => setTitle(e.target.value)}
					value={title}
				/>
				<Select
					w="25%"
					id="write-topic-input"
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
				id="write-content-textarea"
				variant="primary-1"
				placeholder="Contenu du nouvel article"
				flexGrow="2"
				minH="240px"
				onChange={(e) => setContent(e.target.value)}
				value={content}
			/>
			<Button
				id="write-publish-btn"
				variant="primary-yellow"
				onClick={() => uiCreateArticle(false)}
				isDisabled={title === '' || topic === '' || content === ''}
			>
				Publier
			</Button>
			<Stack w="100%" direction={{ base: 'column', md: 'row' }}>
				<Button id="write-pre-visualize-btn" variant="primary-blue" isDisabled>
					Pré-visualisez votre article
				</Button>
				<Button
					id="write-save-draft-btn"
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
