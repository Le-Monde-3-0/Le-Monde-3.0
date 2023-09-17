import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircularProgress, Grid, GridItem, Text, VStack, useToast } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
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
					// if (status === 400) {
					// 	toast({
					// 		title: 'Article inconnu.',
					// 		description: 'Veuillez en renseigner un autre.',
					// 		status: 'error',
					// 		duration: 9000,
					// 		isClosable: true,
					// 	});
					// }
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
			<VStack w="100%" spacing="48px" py="48px">
				<SearchInput
					value={search}
					inputId="favoris-search-input"
					maxW="640px"
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
					{publications
						.filter((p) => (search !== '' ? p.Title.includes(search) : true))
						.map((publication, index) => (
							<GridItem key={`${index.toString}-${publication.Id}`}>
								<ArticleCard
									id={publication.Id}
									title={publication.Title}
									author={`User-${publication.UserId}`}
									date={new Date(publication.CreatedAt).toLocaleDateString('fr-FR')}
									topic="Topic"
									content={publication.Content}
									actions={[
										<>
											<CloseIcon />
											<Text variant="h6">Archiver dans les brouillons</Text>
										</>,
									]}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>
		</>
	);
};

export default Publication;
