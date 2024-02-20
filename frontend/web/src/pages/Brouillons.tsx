import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Tag, Tooltip, VStack, useToast } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import { Article } from 'types/article';

const Brouillons = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const toast = useToast();
	const { auth } = useAuthContext();
	const [brouillons, setBrouillons] = useState<Article[] | undefined>(undefined);

	const me = async () => {
		try {
			const res = await services.articles.me({ token: auth.accessToken! });
			console.log(res.data);
			setBrouillons(res.data.filter((a) => a.Draft === true));
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

	const hardDelete = async (draftId: number) => {
		try {
			const res = await services.articles.delete({ token: auth.accessToken!, articleId: draftId });
			console.log(res);
			setBrouillons([...brouillons!.filter((b) => b.Id !== draftId)]);
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

	const publishDraft = async (draftId: number) => {
		try {
			const res = await services.articles.changeDraftState({
				token: auth.accessToken!,
				articleId: draftId,
				state: false,
			});
			console.log(res);
			setBrouillons([...brouillons!.filter((b) => b.Id !== draftId)]);
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
			me();
		}
	}, [auth]);

	if (!brouillons) {
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
						{brouillons.filter((p) => (search !== '' ? p.Title.includes(search) : true)).length} brouillon
						{brouillons.length !== 1 && 's'}
					</Tag>
					<Tag bg="blue">
						{brouillons
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0)}{' '}
						like
						{brouillons
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
					{brouillons
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
												<ViewIcon onClick={() => publishDraft(brouillon.Id)} color="black" />
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer définitivement">
											<span>
												<DeleteIcon onClick={() => hardDelete(brouillon.Id)} color="black" />
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
