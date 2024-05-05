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
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import { Article } from 'types/article';
import Bookmark from 'types/bookmark';

const ArticlePage = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { articleId } = useParams();
	const { auth } = useAuthContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [article, setArticle] = useState<Article | undefined>(undefined);
	const [bookmarks, setBookmarks] = useState<Bookmark[] | undefined>(undefined);
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

	const read = async () => {
		try {
			const res = await services.articles.read({ token: auth.accessToken!, articleId: +articleId! });
			console.log(res.data);
			setArticle(res.data);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					if (status === 404) {
						toast({
							title: 'Article inconnu.',
							description: 'Veuillez en renseigner un autre.',
							status: 'error',
							duration: 9000,
							isClosable: true,
						});
						navigate('/favoris');
					}
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

	const liked = async () => {
		try {
			const res = await services.articles.liked({ token: auth.accessToken! });
			console.log(res.data);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (res.data.find((a: any) => +a.Id === +articleId!)) {
				setIsLiked(true);
			}
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

	const like = async () => {
		try {
			const res = await services.articles.like({ token: auth.accessToken!, articleId: +articleId! });
			console.log(res.data);
			setIsLiked(true);
			// C'est pourri ça mais il faut l'id du user pour faire mieux
			setArticle({ ...article!, Likes: [...article!.Likes, 1] });
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

	const unlike = async () => {
		try {
			const res = await services.articles.unlike({ token: auth.accessToken!, articleId: +articleId! });
			console.log(res.data);
			setIsLiked(false);
			// C'est pourri ça mais il faut l'id du user pour faire mieux
			setArticle({ ...article!, Likes: [...article!.Likes.slice(1)] });
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
				articleId: +articleId!,
			});
			console.log(res.data);
			toast({
				title: "L'article a été ajouté au marque-page",
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			onClose();
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
			read();
			liked();
			getBookmarks();
		}
	}, [auth]);

	if (!article || !bookmarks) {
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
							onClick={() => (isLiked ? unlike() : like())}
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

export default ArticlePage;
