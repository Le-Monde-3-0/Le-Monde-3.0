import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import ArticleTrigger from 'components/Triggers/ArticleTrigger';

const Article = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { articleId } = useParams();
	const { auth } = useAuthContext();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [article, setArticle] = useState<any | undefined>(undefined);
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
			setArticle({ ...article, Likes: [...article.Likes, 'new'] });
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
			setArticle({ ...article, Likes: [...article.Likes.lenght.slice(1)] });
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
					<CircularProgress size="120px" isIndeterminate color="primary.1" />
				</VStack>
			</>
		);
	}

	return (
		<>
			<ArticleTrigger
				top="4px"
				right="4px"
				actions={[
					<HStack onClick={() => (isLiked ? unlike() : like())}>
						{isLiked ? <CloseIcon /> : <AddIcon />}
						<Text variant="h6">{isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}</Text>
					</HStack>,
				]}
			/>
			<VStack align="left" spacing="64px" w="100%" py="48px">
				<VStack align="left" spacing="0px" w="100%">
					<Text variant="h3">{article.Title}</Text>
					<Text variant="h6">
						Topic - {article.Likes.length} j'aime{article.Likes.length !== 1 && 's'}
					</Text>
				</VStack>
				<Text variant="p" whiteSpace="pre-line">
					{article.Content}
				</Text>
				<VStack align="left" spacing="0px" w="100%">
					<Text variant="h4">Écrit par @user-{article.UserId}</Text>
					<Text variant="h5">{frenchDate(new Date(article.CreatedAt))}</Text>
				</VStack>
			</VStack>
		</>
	);
};

export default Article;
