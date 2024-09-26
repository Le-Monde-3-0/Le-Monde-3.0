import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, HStack, Input, Select, Stack, Textarea, VStack, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useOnlineUserContext } from 'contexts/onlineUser';
import { useUIContext } from 'contexts/ui';
import { Topic } from 'types/topic';

import ReactMarkdown from 'react-markdown';

const Editor = (): JSX.Element => {
	const navigate = useNavigate();
	const { handleToast } = useUIContext();
	const onlineUser = useOnlineUserContext();
	const [topics, setTopics] = useState<Topic[]>([]);
	const [title, setTitle] = useState('');
	const [topic, setTopic] = useState('');
	const [content, setContent] = useState(''); // Store raw markdown content
	const [showPreview, setShowPreview] = useState(false); // State to toggle preview visibility

	const uiSearchAllTopics = async () => {
		try {
			const res = await onlineUser.methods.topics.search.all();
			handleToast(res);
			if (res.status === 'success') setTopics(res.data!);
		} catch (error) {
			console.error(error);
		}
	};

	const uiCreateArticle = async (draft: boolean) => {
		try {
			const res = await onlineUser.methods.articles.create({
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

			{/* HStack for Textarea and Markdown preview, only show preview if showPreview is true */}
			<HStack w="100%"  alignItems="start" spacing="8px">
				{/* Textarea for entering raw Markdown */}
				<Textarea
					id="write-content-textarea"
					variant="primary-1"
					placeholder="Contenu du nouvel article"
					flexGrow={showPreview ? '1' : '2'} // Adjust width when preview is shown
					minH="800px"
					onChange={(e) => setContent(e.target.value)} // Set content as raw text
					value={content}
				/>

				{/* Conditionally render the preview box */}
				{showPreview && (
					<Box w="100%" p="4" border="1px solid #ccc" borderRadius="md" minH="800px">
						<h3>Markdown Preview:</h3>
						<ReactMarkdown>{content}</ReactMarkdown> {/* Render markdown here */}
					</Box>
				)}
			</HStack>

			<Button
				id="write-publish-btn"
				variant="primary-yellow"
				onClick={() => uiCreateArticle(false)}
				isDisabled={title === '' || topic === '' || content === ''}
			>
				Publier
			</Button>

			<Stack w="100%" direction={{ base: 'column', md: 'row' }}>
				{/* Button to toggle the visibility of the Markdown preview */}
				<Button
					id="write-pre-visualize-btn"
					variant="primary-blue"
					onClick={() => setShowPreview((prev) => !prev)} // Toggle preview on click
					isDisabled={content === ''}
				>
					{showPreview ? 'Masquer la prévisualisation' : 'Pré-visualisez votre article'}
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
