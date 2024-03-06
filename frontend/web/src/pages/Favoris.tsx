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
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Favoris = (): JSX.Element => {
	const { auth } = useAuthContext();
	const { requestResponseToast } = useUIContext();
	const { user, addArticleToBookmark, getLikedArticles, getBookmarks, unlikeArticle } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [articleToAdd, setArticleToAdd] = useState<number | undefined>(undefined);

	const uiGetLikedArticles = async () => {
		try {
			const res = await getLikedArticles();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiUnlikeArticle = async (articleId: number) => {
		try {
			const res = await unlikeArticle(articleId);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiGetBookmarks = async () => {
		try {
			const res = await getBookmarks();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiAddArticleToBookmark = async (bookmarkId: number) => {
		try {
			const res = await addArticleToBookmark(bookmarkId, articleToAdd!);
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
		if (auth.accessToken) {
			uiGetLikedArticles();
			uiGetBookmarks();
		}
	}, [auth]);

	if (!user.likedArticles || !user.bookmarks) {
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
					{user.likedArticles.length} favori
					{user.likedArticles.length !== 1 && 's'}
				</Tag>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{user.likedArticles
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
												<CloseIcon onClick={() => uiUnlikeArticle(article.Id)} color="black" />
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
							{user.bookmarks.length} marque-page{user.bookmarks.length !== 1 && 's'}
						</Text>
						<VStack spacing="8px" mb="12px">
							{user.bookmarks.map((bookmark, index) => (
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
									onClick={() => uiAddArticleToBookmark(bookmark.Id)}
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
