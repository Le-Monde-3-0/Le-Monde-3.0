import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Tag, Tooltip, VStack, useToast } from '@chakra-ui/react';
import { DeleteIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import { Article } from 'types/article';

const Publications = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const toast = useToast();
	const { auth } = useAuthContext();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [publications, setPublications] = useState<Article[] | undefined>(undefined);

	const me = async () => {
		try {
			const res = await services.articles.me({ token: auth.accessToken! });
			console.log(res.data);
			setPublications(res.data.filter((a) => a.Draft === false));
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

	const hardDelete = async (articleId: number) => {
		try {
			const res = await services.articles.delete({ token: auth.accessToken!, articleId });
			console.log(res);
			setPublications([...publications!.filter((p) => p.Id !== articleId)]);
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

	const publishDraft = async (articleId: number) => {
		try {
			const res = await services.articles.changeDraftState({ token: auth.accessToken!, articleId, state: true });
			console.log(res);
			setPublications([...publications!.filter((p) => p.Id !== articleId)]);
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

	if (!publications) {
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
					<Tag bg="yellow">
						{publications.filter((p) => (search !== '' ? p.Title.includes(search) : true)).length} publication
						{publications.length !== 1 && 's'}
					</Tag>
					<Tag bg="blue">
						{publications
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes.length)
							.reduce((a, v) => a + v, 0)}{' '}
						like
						{publications
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
					{publications
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
												<ViewOffIcon onClick={() => publishDraft(publication.Id)} color="black" />
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer définitivement">
											<span>
												<DeleteIcon onClick={() => hardDelete(publication.Id)} color="black" />
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
