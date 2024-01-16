import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Favoris = (): JSX.Element => {
	const toast = useToast();
	const { auth } = useAuthContext();
	const [search, setSearch] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [articles, setArticles] = useState<any[] | undefined>(undefined);

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

	const unlike = async (articleId: string) => {
		try {
			const res = await services.articles.unlike({ token: auth.accessToken!, articleId });
			console.log(res);
			setArticles({ ...articles!.filter((a) => a.Id !== articleId) });
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
		}
	}, [auth]);

	if (!articles) {
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
			<VStack w="100%" spacing="48px" py="48px">
				<SearchInput
					value={search}
					inputId="favoris-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
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
									topic={article.topic}
									content={article.Content}
									actions={[
										<HStack onClick={() => unlike(article.Id)}>
											<CloseIcon />
											<Text variant="h6">Retirer des favoris</Text>
										</HStack>,
									]}
									likes={article.Likes.length}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</>
	);
};

export default Favoris;
