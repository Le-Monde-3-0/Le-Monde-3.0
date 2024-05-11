import { DeleteIcon, EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
	CircularProgress,
	Grid,
	GridItem,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tag,
	Tooltip,
	VStack,
} from '@chakra-ui/react';
import ArticleCard from 'components/Cards/ArticleCard';
import Editor from 'components/Editor/Editor';
import SearchInput from 'components/Inputs/SearchInput';
import { useAuthContext } from 'contexts/auth';
import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import * as React from 'react';
import { useEffect, useState } from 'react';

const Brouillons = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const [editor, setEditor] = useState<boolean>(false);
	const [draft, setDraft] = useState({
		title: '',
		topic: '',
		content: '',
	});
	const { auth } = useAuthContext();
	const { requestResponseToast } = useUIContext();
	const { user, deleteArticle, getArticles, switchArticleDraftState } = useUserContext();

	const uiGetArticles = async () => {
		try {
			const res = await getArticles();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiDeleteArticle = async (articleId: number) => {
		try {
			const res = await deleteArticle(articleId);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiSwitchArticleDraftState = async (articleId: number) => {
		try {
			const res = await switchArticleDraftState(articleId);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiGetArticles();
	}, [auth]);

	if (!user.draftArticles) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="black" />
				</VStack>
			</>
		);
	}

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<SearchInput
					value={search}
					inputId="brouillons-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles publiés"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<HStack>
					<Tag bg="primary.yellow">
						{user.draftArticles.filter((p) => (search !== '' ? p.Title.includes(search) : true)).length} brouillon
						{user.draftArticles.length !== 1 && 's'}
					</Tag>
					<Tag bg="primary.blue">
						{user.draftArticles
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0)}{' '}
						like
						{user.draftArticles
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0) !== 1 && 's'}
					</Tag>
				</HStack>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{user.draftArticles
						.filter((p) => (search !== '' ? p.Title.includes(search) : true))
						.map((brouillon, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={brouillon.Id}
									title={brouillon.Title}
									author={brouillon.AuthorName}
									date={new Date().toLocaleDateString('fr-FR')}
									topic={brouillon.Topic}
									content={brouillon.Content}
									actions={[
										<Tooltip label="Éditer l'article">
											<span>
												<EditIcon
													onClick={() => {
														setEditor(true);
														setDraft({
															title: brouillon.Title,
															topic: brouillon.Topic,
															content: brouillon.Content,
														});
													}}
													color="black"
												/>
											</span>
										</Tooltip>,
										<Tooltip label="Publier l'article">
											<span>
												<ExternalLinkIcon onClick={() => uiSwitchArticleDraftState(brouillon.Id)} color="black" />
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer définitivement">
											<span>
												<DeleteIcon onClick={() => uiDeleteArticle(brouillon.Id)} color="black" />
											</span>
										</Tooltip>,
									]}
									view="publisher"
									views={brouillon.TotalViews}
									likes={+brouillon.Likes.length}
								/>
							</GridItem>
						))}
				</Grid>
				<Modal isOpen={editor} size="full" onClose={() => setEditor(false)}>
					<ModalOverlay />
					<ModalContent bg="black">
						<ModalHeader color="gray.100">Brouillon</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Editor
								placeholderTitle={draft.title}
								placeholderTopic={draft.topic}
								placeholderContent={draft.content}
							/>
						</ModalBody>
					</ModalContent>
				</Modal>
			</VStack>
		</>
	);
};

export default Brouillons;
