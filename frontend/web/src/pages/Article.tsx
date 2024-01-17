import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, CircularProgress, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import { Article } from 'types/article';

const ArticlePage = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { articleId } = useParams();
	const { auth } = useAuthContext();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	const read = async () => {
		try {
			const res = await services.articles.read({ token: auth.accessToken!, articleId: articleId! });
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
			const res = await services.articles.like({ token: auth.accessToken!, articleId: articleId! });
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
			const res = await services.articles.unlike({ token: auth.accessToken!, articleId: articleId! });
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

	useEffect(() => {
		if (auth.accessToken) {
			read();
			liked();
		}
	}, [auth]);

	if (!article) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="black" />
				</VStack>
			</>
		);
	}

	return (
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
					<Badge fontSize={{ base: 'small', lg: 'md' }} cursor="pointer" borderRadius="xsm">
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
	);
};

export default ArticlePage;
