import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, HStack, Tag, Tooltip, VStack, useToast } from '@chakra-ui/react';
import { DeleteIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Publication = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const toast = useToast();
	const { auth } = useAuthContext();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [publications, setPublications] = useState<any[] | undefined>(undefined);

	const me = async () => {
		try {
			const res = await services.articles.me({ token: auth.accessToken! });
			setPublications(res.data);
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

	const hardDelete = async (articleId: string) => {
		try {
			const res = await services.articles.delete({ token: auth.accessToken!, articleId });
			console.log(res.data);
			setPublications({ ...publications!.filter((p) => p.Id !== articleId) });
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
					<CircularProgress size="120px" isIndeterminate color="primary.1" />
				</VStack>
			</>
		);
	}

	return (
		<>
			<VStack w="100%" spacing={{ base: '16px', md: '24px' }} align="start">
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
							.map((p) => p.Likes)
							.reduce((a, v) => a + v, 0)}{' '}
						like
						{publications
							.filter((p) => (search !== '' ? p.Title.includes(search) : true))
							.map((p) => p.Likes)
							.reduce((a, v) => a + v, 0) !== 1 && 's'}
					</Tag>
				</HStack>
				<Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
					{publications
						.filter((p) => (search !== '' ? p.Title.includes(search) : true))
						.map((publication, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={publication.Id}
									title={publication.Title}
									author={`User-${publication.UserId}`}
									date={new Date(publication.CreatedAt).toLocaleDateString('fr-FR')}
									topic="Topic"
									content={publication.Content}
									actions={[
										<Tooltip label="Archiver dans les brouillons">
											<span>
												<ViewOffIcon color="black" />
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer définitivement">
											<span>
												<DeleteIcon onClick={() => hardDelete(publication.Id)} color="black" />
											</span>
										</Tooltip>,
									]}
									view="publisher"
									likes={+publication.Likes.length}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</>
	);
};

export default Publication;
