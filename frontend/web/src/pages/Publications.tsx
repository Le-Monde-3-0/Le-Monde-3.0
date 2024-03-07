import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Tag, Tooltip, VStack } from '@chakra-ui/react';
import { DeleteIcon, ViewOffIcon } from '@chakra-ui/icons';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Publications = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const { auth } = useAuthContext();
	const { requestResponseToast } = useUIContext();
	const { user, switchArticleDraftState, deleteArticle, getArticles } = useUserContext();

	const uiGetArticles = async () => {
		try {
			const res = await getArticles();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiDeleteArticle = async (articleId: number) => {
		try {
			const res = await deleteArticle(articleId);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiSwitchArticleDraftState = async (articleId: number) => {
		try {
			const res = await switchArticleDraftState(articleId);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (auth.accessToken) {
			uiGetArticles();
		}
	}, [auth]);

	if (!user.publishedArticles) {
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
					inputId="publications-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles publiés"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<HStack>
					<Tag bg="primary.yellow">
						{user.publishedArticles.filter((p) => (search !== '' ? p.Title.includes(search) : true)).length} publication
						{user.publishedArticles.length !== 1 && 's'}
					</Tag>
					<Tag bg="primary.blue">
						{user.publishedArticles
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0)}{' '}
						like
						{user.publishedArticles
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0) !== 1 && 's'}
					</Tag>
				</HStack>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{user.publishedArticles
						.filter((p) => (search !== '' ? p.Title.includes(search) : true))
						.map((publication, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={publication.Id}
									title={publication.Title}
									author={publication.AuthorName}
									date={new Date().toLocaleDateString('fr-FR')}
									topic={publication.Topic}
									content={publication.Content}
									actions={[
										<Tooltip label="Archiver dans les brouillons">
											<span>
												<ViewOffIcon onClick={() => uiSwitchArticleDraftState(publication.Id)} color="black" />
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer définitivement">
											<span>
												<DeleteIcon onClick={() => uiDeleteArticle(publication.Id)} color="black" />
											</span>
										</Tooltip>,
									]}
									likes={publication.Likes.length}
									view="publisher"
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</>
	);
};

export default Publications;
