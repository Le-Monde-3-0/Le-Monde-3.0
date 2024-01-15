import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Nouveautes = (): JSX.Element => {
	const toast = useToast();
	const { auth } = useAuthContext();
	const [search, setSearch] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [newArticles, setNewArticles] = useState<any[] | undefined>(undefined);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [likedArticles, setLikedArticles] = useState<any[] | undefined>(undefined);
	const [reload, setReload] = useState(1);

	const getNewArticles = async () => {
		try {
			const res = await services.articles.liked({ token: auth.accessToken! });
			console.log(res.data);
			setNewArticles(res.data);
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

	const getLikedArticles = async () => {
		try {
			const res = await services.articles.liked({ token: auth.accessToken! });
			console.log(res.data);
			setLikedArticles(res.data);
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

	const like = async (articleId: string) => {
		try {
			const res = await services.articles.like({ token: auth.accessToken!, articleId });
			console.log(res.data);
			setReload(reload + 1);
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

	const unlike = async (articleId: string) => {
		try {
			const res = await services.articles.unlike({ token: auth.accessToken!, articleId });
			console.log(res.data);
			setReload(reload + 1);
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

	const isLiked = (articleId: string) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (likedArticles!.find((a: any) => +a.Id === +articleId!)) {
			return true;
		}
		return false;
	};

	useEffect(() => {
		if (auth.accessToken) {
			getNewArticles();
			getLikedArticles();
		}
	}, [auth]);

	useEffect(() => {
		if (reload > 1) {
			getNewArticles();
			getLikedArticles();
		}
	}, [reload]);

	if (!newArticles) {
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
			<VStack w="100%" spacing="48px" py="48px">
				<SearchInput
					value={search}
					inputId="nouveautes-search-input"
					maxW="640px"
					placeholder="Cherchez parmis les nouveaux articles"
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
					{newArticles
						.filter((a) => (search !== '' ? a.Title.includes(search) : true))
						.map((article, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={article.Id}
									title={article.Title}
									author={`User-${article.UserId}`}
									date={new Date(article.CreatedAt).toLocaleDateString('fr-FR')}
									topic="Topic"
									content={article.Content}
									actions={[
										<HStack onClick={() => (isLiked(article.Id) ? unlike(article.Id) : like(article.Id))}>
											{isLiked(article.Id) ? <CloseIcon /> : <AddIcon />}
											<Text variant="h6">{isLiked(article.Id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}</Text>
										</HStack>,
									]}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</>
	);
};

export default Nouveautes;
