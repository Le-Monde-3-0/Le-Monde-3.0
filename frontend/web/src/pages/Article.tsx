import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Badge,
	CircularProgress,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';
import { Article } from 'types/article';

const ArticlePage = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { articleId } = useParams();
	const { auth } = useAuthContext();
	const { user, addArticleToBookmark, getArticle, getBookmarks, getLikedArticles, likeArticle, unlikeArticle } =
		useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [article, setArticle] = useState<Article | undefined>(undefined);
	const [isLiked, setIsLiked] = useState(false);

	const frenchDate = (date: Date) => {
		const mois = [
			'Janvier',
			'Février',
			'Mars',
			'Avril',
			'Mai',
			'Juin',
			'Juillet',
			'Août',
			'Septembre',
			'Octobre',
			'Novembre',
			'Décembre',
		];

		const year = date.getFullYear();
		const dayNumber = date.getDate();
		const month = mois[date.getMonth()];
		const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });

		const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		return `${capitalize(weekday)}, le ${dayNumber} ${month} ${year}`;
	};

	const uiGetArticle = async () => {
		try {
			const res = await getArticle(+articleId!);
			if (res.status !== 'success') {
				console.log(res);
				toast({
					status: res.status,
					title: res.message,
					description: res.subMessage,
					duration: 5000,
					isClosable: true,
				});
				if (res.code === 404) {
					navigate('/favoris');
				}
			} else {
				setArticle(res.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uiGetLikedArticles = async () => {
		try {
			const res = await getLikedArticles();
			if (res.status !== 'success') {
				toast({
					status: res.status,
					title: res.message,
					description: res.subMessage,
					duration: 5000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uiLikeArticle = async () => {
		try {
			const res = await likeArticle(+articleId!);
			if (res.status !== 'success') {
				toast({
					status: res.status,
					title: res.message,
					description: res.subMessage,
					duration: 5000,
					isClosable: true,
				});
			} else {
				setIsLiked(true);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uiUnlikeArticle = async () => {
		try {
			const res = await unlikeArticle(+articleId!);
			if (res.status !== 'success') {
				toast({
					status: res.status,
					title: res.message,
					description: res.subMessage,
					duration: 5000,
					isClosable: true,
				});
			} else {
				setIsLiked(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uiGetBookmarks = async () => {
		try {
			const res = await getBookmarks();
			if (res.status !== 'success') {
				toast({
					status: res.status,
					title: res.message,
					description: res.subMessage,
					duration: 5000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const uiAddArticleToBookmark = async (bookmarkId: number) => {
		try {
			const res = await addArticleToBookmark(bookmarkId, +articleId!);
			if (res.status !== 'success') {
				toast({
					status: res.status,
					title: res.message,
					description: res.subMessage,
					duration: 5000,
					isClosable: true,
				});
			} else {
				onClose();
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (auth.accessToken) {
			uiGetArticle();
			uiGetLikedArticles();
			uiGetBookmarks();
		}
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
					</HStack>
					<VStack align="left" spacing="0px" w="100%">
						<Text variant="h3">{article.Title}</Text>
						<HStack>
							<Badge colorScheme="red" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
								{article.Topic}
							</Badge>
							<Badge colorScheme="green" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
								{article.Likes.length} like{article.Likes.length !== 1 && 's'}
							</Badge>
						</HStack>
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
