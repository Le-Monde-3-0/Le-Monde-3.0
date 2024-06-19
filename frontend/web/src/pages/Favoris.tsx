import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	Badge,
	CircularProgress,
	Grid,
	GridItem,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Tooltip,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Favoris = (): JSX.Element => {
	const { requestResponseToast } = useUIContext();
	const { user, likeArticle, loadLikedArticles, loadAnthologies, updateAnthology } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [articleToAdd, setArticleToAdd] = useState<number | undefined>(undefined);

	const uiLoadLikedArticles = async () => {
		try {
			const res = await loadLikedArticles();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiUnlikeArticle = async (id: number) => {
		try {
			const res = await likeArticle({ id, isLiked: false });
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiloadAnthologies = async () => {
		try {
			const res = await loadAnthologies();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiUpdateAnthology = async (anthologyId: number) => {
		try {
			const res = await updateAnthology({
				id: anthologyId,
				addArticles: [articleToAdd!],
			});
			requestResponseToast(res);
			if (res.status === 'success') {
				onClose();
				setArticleToAdd(undefined);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiLoadLikedArticles();
		uiloadAnthologies();
	}, []);

	if (!user.articles.liked || !user.anthologies) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="yellow" />
				</VStack>
			</>
		);
	}

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<SearchInput
					value={search}
					inputId="favoris-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<HStack>
					<Text variant="h5">Favori{user.articles.liked.length !== 1 && 's'}</Text>
					<Text
						variant="h5"
						bg="primary.yellow"
						color="gray.900 !important"
						fontWeight="black"
						p="0px 8px"
						borderRadius="md"
					>
						{user.articles.liked.length}
					</Text>
				</HStack>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{user.articles.liked
						.filter((a) => (search !== '' ? a.title.includes(search) : true))
						.map((article, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={article.id}
									title={article.title}
									// TODO: author name
									author="Author"
									date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
									// TODO: topic name
									topic="Topic"
									content={article.content}
									actions={[
										<Tooltip label="Ajouter à un marque-page">
											<span>
												<AddIcon
													onClick={() => {
														setArticleToAdd(article.id);
														onOpen();
													}}
													color="black"
												/>
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer des favoris">
											<span>
												<CloseIcon onClick={() => uiUnlikeArticle(article.id)} color="black" />
											</span>
										</Tooltip>,
									]}
									likes={article.totalLikes}
									views={article.totalViews}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>

			<Modal
				isOpen={isOpen}
				onClose={() => {
					setArticleToAdd(undefined);
					onClose();
				}}
			>
				<ModalOverlay />
				<ModalContent bg="gray.900">
					<ModalHeader color="white">Dossiers</ModalHeader>
					<ModalCloseButton color="white" />
					<ModalBody>
						<Text variant="p" mb="8px">
							{user.anthologies.length} dossier{user.anthologies.length !== 1 && 's'}
						</Text>
						<VStack spacing="8px" mb="12px">
							{user.anthologies.map((anthology, index) => (
								<HStack
									key={`${index.toString()}`}
									w="100%"
									align="baseline"
									justify="space-between"
									p={{ base: '8px', xl: '16px' }}
									bg="gray.200"
									borderRadius="sm"
									cursor="pointer"
									_hover={{ opacity: 0.9 }}
									onClick={() => uiUpdateAnthology(anthology.id)}
								>
									<Text variant="link" color="black !important" cursor="pointer" _hover={{ opacity: '0.8' }}>
										{anthology.name}
									</Text>
									// TODO: nombre d'articles
									<Badge colorScheme="green" borderRadius="xsm">
										x articles
									</Badge>
								</HStack>
							))}
						</VStack>
					</ModalBody>
				</ModalContent>
				<ModalFooter></ModalFooter>
			</Modal>
		</>
	);
};

export default Favoris;
