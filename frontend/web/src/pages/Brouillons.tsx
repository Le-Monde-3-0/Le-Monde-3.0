import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Tag, Tooltip, VStack, useToast } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';

import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Brouillons = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const toast = useToast();
	const { auth } = useAuthContext();
	const { user, deleteArticle, getDraftArticles, switchArticleDraftState } = useUserContext();

	const uiGetDraftArticles = async () => {
		try {
			const res = await getDraftArticles();
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

	const uiDeleteArticle = async (articleId: number) => {
		try {
			const res = await deleteArticle(articleId);
			toast({
				status: res.status,
				title: res.message,
				description: res.subMessage,
				duration: 5000,
				isClosable: true,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const uiSwitchArticleDraftState = async (articleId: number) => {
		try {
			const res = await switchArticleDraftState(articleId);
			toast({
				status: res.status,
				title: res.message,
				description: res.subMessage,
				duration: 5000,
				isClosable: true,
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (auth.accessToken) {
			uiGetDraftArticles();
		}
	}, [auth]);

	if (!user.draftArticles) {
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
					inputId="brouillons-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles publiés"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<HStack>
					<Tag bg="yellow">
						{user.draftArticles.filter((p) => (search !== '' ? p.Title.includes(search) : true)).length} brouillon
						{user.draftArticles.length !== 1 && 's'}
					</Tag>
					<Tag bg="blue">
						{user.draftArticles
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0)}{' '}
						like
						{user.draftArticles
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
					{user.draftArticles
						.filter((p) => (search !== '' ? p.Title.includes(search) : true))
						.map((brouillon, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={brouillon.Id}
									title={brouillon.Title}
									author={brouillon.AuthorName}
									date={new Date().toLocaleDateString('fr-FR')}
									topic={brouillon.Topic}
									content={brouillon.Content}
									actions={[
										<Tooltip label="Publier l'article">
											<span>
												<ViewIcon onClick={() => uiSwitchArticleDraftState(brouillon.Id)} color="black" />
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer définitivement">
											<span>
												<DeleteIcon onClick={() => uiDeleteArticle(brouillon.Id)} color="black" />
											</span>
										</Tooltip>,
									]}
									view="publisher"
									likes={+brouillon.Likes.length}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</>
	);
};

export default Brouillons;
