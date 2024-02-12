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
	Tag,
	Text,
	Tooltip,
	VStack,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import { Article } from 'types/article';
import Bookmark from 'types/bookmark';

const Favoris = (): JSX.Element => {
	const toast = useToast();
	const { auth } = useAuthContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [articles, setArticles] = useState<Article[] | undefined>(undefined);
	const [bookmarks, setBookmarks] = useState<Bookmark[] | undefined>(undefined);
	const [articleToAdd, setArticleToAdd] = useState<number | undefined>(undefined);

	const getArticles = async () => {
		try {
			const res = await services.articles.liked({ token: auth.accessToken! });
			setArticles(res.data);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					console.log(status);
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

	const unlike = async (articleId: number) => {
		try {
			const res = await services.articles.unlike({ token: auth.accessToken!, articleId });
			console.log(res);
			setArticles([...articles!.filter((a) => a.Id !== articleId)]);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					console.log(status);
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

	const getBookmarks = async () => {
		try {
			const res = await services.bookmarks.getAll({ token: auth.accessToken! });
			console.log(res.data);
			setBookmarks(res.data);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					console.log(status);
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

	const addArticleToBookmark = async (bookmarkId: number) => {
		try {
			const res = await services.bookmarks.addArticle({
				token: auth.accessToken!,
				bookmarkId,
				articleId: articleToAdd!,
			});
			console.log(res.data);
			toast({
				title: "L'article a été ajouté au marque-page",
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			onClose();
			setArticleToAdd(undefined);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					console.log(status);
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

	useEffect(() => {
		if (auth.accessToken) {
			getArticles();
			getBookmarks();
		}
	}, [auth]);

	if (!articles || !bookmarks) {
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
					inputId="favoris-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<Tag bg="yellow">
					{articles.length} favori
					{articles.length !== 1 && 's'}
				</Tag>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{articles
						.filter((a) => (search !== '' ? a.Title.includes(search) : true))
						.map((article, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={article.Id}
									title={article.Title}
									author={article.AuthorName}
									date={new Date(article.CreatedAt).toLocaleDateString('fr-FR')}
									topic={article.Topic}
									content={article.Content}
									actions={[
										<Tooltip label="Ajouter à un marque-page">
											<span>
												<AddIcon
													onClick={() => {
														setArticleToAdd(article.Id);
														onOpen();
													}}
													color="black"
												/>
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer des favoris">
											<span>
												<CloseIcon onClick={() => unlike(article.Id)} color="black" />
											</span>
										</Tooltip>,
									]}
									likes={article.Likes.length}
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
					<ModalHeader color="white">Marque-pages</ModalHeader>
					<ModalCloseButton color="white" />
					<ModalBody>
						<Text variant="p" mb="8px">
							{bookmarks.length} marque-page{bookmarks.length !== 1 && 's'}
						</Text>
						<VStack spacing="8px" mb="12px">
							{bookmarks.map((bookmark, index) => (
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
									onClick={() => addArticleToBookmark(bookmark.Id)}
								>
									<Text variant="link" color="black !important" cursor="pointer" _hover={{ opacity: '0.8' }}>
										{bookmark.Title}
									</Text>
									<Badge colorScheme="green" borderRadius="xsm">
										{bookmark.Articles.length} article{bookmark.Articles.length !== 1 && 's'}
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
