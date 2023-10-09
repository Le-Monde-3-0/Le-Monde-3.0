import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import { Article } from 'types/article';

const Favoris = (): JSX.Element => {
	const toast = useToast();
	const { auth } = useAuthContext();
	const [search, setSearch] = useState('');
	const [articles, setArticles] = useState<Article[] | undefined>(undefined);
	const [reload, setReload] = useState(1);

	const getArticles = async () => {
		try {
			const res = await services.articles.liked({ token: auth.accessToken! });
			console.log(res.data);
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

	useEffect(() => {
		if (auth.accessToken) {
			getArticles();
		}
	}, [auth]);

	useEffect(() => {
		if (reload > 1) {
			getArticles();
		}
	}, [reload]);

	if (!articles) {
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
					inputId="favoris-search-input"
					maxW="640px"
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
					{articles
						.filter((a) => (search !== '' ? a.title.includes(search) : true))
						.map((article, index) => (
							<GridItem key={`${index.toString}-${article.id}`}>
								<ArticleCard
									id={article.id.toString()}
									title={article.title}
									author={`User-${article.userId}`}
									// date={new Date(article.CreatedAt).toLocaleDateString('fr-FR')}
									date={new Date().toLocaleDateString('fr-FR')}
									topic="Topic"
									content={article.content}
									actions={[
										<HStack onClick={() => unlike(article.id)}>
											<CloseIcon />
											<Text variant="h6">Retirer des favoris</Text>
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

export default Favoris;
