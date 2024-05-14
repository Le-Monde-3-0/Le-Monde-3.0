import { AddIcon, CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
	Badge,
	CircularProgress,
	Collapse,
	Grid,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { Chart } from 'components/Chart/Chart';
import { useAuthContext } from 'contexts/auth';
import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Article } from 'types/article';
import frenchDate from 'utils/frenchDate';
// import { generateDailyStats } from 'utils/generateDailyStats';

import Editor from '../components/Editor/Editor';

const ArticlePage = (): JSX.Element => {
	const navigate = useNavigate();
	const { articleId } = useParams();
	const { auth } = useAuthContext();
	const { requestResponseToast } = useUIContext();
	const { user, addArticleToBookmark, getArticle, getBookmarks, getLikedArticles, likeArticle, unlikeArticle } =
		useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editor, setEditor] = useState(false);
	const [article, setArticle] = useState<Article | undefined>(undefined);
	const [isLiked, setIsLiked] = useState(false);
	const [isViewChartDisplayed, setViewChartDisplay] = useState(false);
	const [isLikeChartDisplayed, setLikeChartDisplay] = useState(false);

	const toggleViewChartDisplay = () => {
		setViewChartDisplay(!isViewChartDisplayed);
		console.log(article?.DailyViews);
	};

	const toggleLikeChartDisplay = () => {
		setLikeChartDisplay(!isLikeChartDisplayed);
	};

	const uiGetArticle = async () => {
		try {
			const res = await getArticle(+articleId!);

			requestResponseToast(res);
			if (res.code === 404) {
				navigate('/favoris');
			} else if (res.data !== undefined && res.status === 'success') {
				// res.data.TotalViews = Math.floor(Math.random() * 1000);
				// res.data.DailyViews = generateDailyStats(res.data.TotalViews);
				// res.data.DailyLikes = generateDailyStats(Math.floor(Math.random() * 1000));
				setArticle(res.data);
			}
		} catch (error: unknown) {
			console.error(error);
		}
	};

	const uiGetLikedArticles = async () => {
		try {
			const res = await getLikedArticles();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiLikeArticle = async () => {
		try {
			const res = await likeArticle(+articleId!);
			requestResponseToast(res);
			if (res.status === 'success') {
				setIsLiked(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiUnlikeArticle = async () => {
		try {
			const res = await unlikeArticle(+articleId!);
			requestResponseToast(res);
			if (res.status === 'success') {
				setIsLiked(false);
			}
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
			const res = await addArticleToBookmark(bookmarkId, +articleId!);
			requestResponseToast(res);
			if (res.status === 'success') {
				onClose();
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiGetArticle();
		uiGetLikedArticles();
		uiGetBookmarks();
	}, [auth]);

	useEffect(() => {
		if (user.likedArticles.find((a) => a.Id === +articleId!)) {
			setIsLiked(true);
		}
	}, [user]);

	if (!article || !user.bookmarks) {
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
			<VStack w="100%" spacing={{ base: '24px', md: '32px', lg: '40px' }} align="start">
				<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
					<HStack>
						<Badge
							colorScheme="pink"
							variant={isLiked ? 'solid' : 'outline'}
							fontSize={{ base: 'small', lg: 'md' }}
							cursor="pointer"
							borderRadius="xsm"
							onClick={() => (isLiked ? uiUnlikeArticle() : uiLikeArticle())}
						>
							{isLiked ? <CheckIcon /> : <CloseIcon />} Favoris
						</Badge>
						<Badge fontSize={{ base: 'small', lg: 'md' }} cursor="pointer" borderRadius="xsm" onClick={onOpen}>
							<AddIcon /> Marque-page
						</Badge>
						<Badge
							fontSize={{ base: 'small', lg: 'md' }}
							cursor="pointer"
							borderRadius="xsm"
							onClick={() => {
								setEditor(true);
							}}
						>
							<EditIcon /> Modifier
						</Badge>
					</HStack>
					<VStack align="left" spacing="0px" w="100%">
						<Text variant="h3">{article.Title}</Text>
						<HStack>
							<Badge colorScheme="red" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
								{article.Topic}
							</Badge>
							<Badge
								colorScheme="green"
								fontSize={{ base: 'small', lg: 'md' }}
								borderRadius="xsm"
								onClick={toggleLikeChartDisplay}
								cursor={'pointer'}
							>
								{article.Likes.length} like{article.Likes.length !== 1 && 's'}
							</Badge>
							<Badge
								colorScheme="blue"
								fontSize={{ base: 'small', lg: 'md' }}
								borderRadius="xsm"
								cursor="pointer"
								onClick={toggleViewChartDisplay}
							>
								{article.TotalViews} view{article.TotalViews !== 1 && 's'}
							</Badge>
						</HStack>
						<Grid
							templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
							gap={{ base: 2, lg: 4 }}
							w="100%"
						>
							<Collapse in={isLikeChartDisplayed} animateOpacity>
								<Chart yLabel="Likes" data={article.DailyLikes} />
							</Collapse>
							<Collapse in={isViewChartDisplayed} animateOpacity>
								<Chart yLabel="Vues" data={article.DailyViews} />
							</Collapse>
						</Grid>
					</VStack>
					<Text variant="p" whiteSpace="pre-line">
						{article.Content}
					</Text>
				</VStack>
				<VStack align="left" spacing="0px" w="100%">
					<Text variant="h6">Écrit par @user-{article.UserId}</Text>
					<Text variant="p">{frenchDate(new Date(article.CreatedAt))}</Text>
				</VStack>
			</VStack>
			<Modal isOpen={editor} size="full" onClose={() => setEditor(false)}>
				<ModalOverlay />
				<ModalContent bg="black">
					<ModalHeader color="gray.100">Brouillon</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Editor
							placeholderTitle={article.Title}
							placeholderTopic={article.Topic}
							placeholderContent={article.Content}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Modal isOpen={isOpen} onClose={onClose}>
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

export default ArticlePage;
