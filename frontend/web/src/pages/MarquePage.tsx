import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Tag, VStack, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';

import services from 'services';
import { useAuthContext } from 'contexts/auth';
import SearchInput from 'components/Inputs/SearchInput';
import Bookmark from 'types/bookmark';

const MarquePage = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { auth } = useAuthContext();
	const { bookmarkId } = useParams();
	const [search, setSearch] = useState('');
	const [bookmark, setBookmark] = useState<Bookmark | undefined>(undefined);

	const getBookmark = async () => {
		try {
			console.log(bookmarkId);
			const res = await services.bookmarks.get({ token: auth.accessToken!, bookmarkId: +bookmarkId! });
			console.log(res.data);
			setBookmark(res.data);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					if (status === 404) {
						toast({
							title: 'Bookmark inconnu.',
							description: 'Veuillez en renseigner un autre.',
							status: 'error',
							duration: 9000,
							isClosable: true,
						});
						navigate('/marque-pages');
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

	const removeArticle = async (articleId: number) => {
		try {
			const res = await services.bookmarks.removeArticle({
				token: auth.accessToken!,
				bookmarkId: +bookmarkId!,
				articleId,
			});
			console.log(res);
			// setArticles(...);
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

	const unlikeArticle = async (articleId: number) => {
		try {
			const res = await services.articles.unlike({ token: auth.accessToken!, articleId });
			console.log(res);
			// setArticles([...articles!.filter((a) => a.Id !== articleId)]);
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

	const likeArticle = async (articleId: number) => {
		try {
			const res = await services.articles.like({ token: auth.accessToken!, articleId });
			console.log(res);
			// setArticles([...articles!.filter((a) => a.Id !== articleId)]);
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
			getBookmark();
		}
	}, [auth]);

	if (!bookmark) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="black" />
				</VStack>
			</>
		);
	}

	return (
		<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
			<SearchInput
				value={search}
				inputId="favoris-search-input"
				w={{ base: '100%', xl: '640px' }}
				placeholder="Cherchez parmis vos articles favoris"
				onChange={(e) => setSearch(e.target.value)}
				variant="primary-1"
			/>
			<Tag bg="yellow">
				{bookmark.Articles.length} article
				{bookmark.Articles.length !== 1 && 's'}
			</Tag>
			{/* <Grid
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
								topic={article.Topic}
								content={article.Content}
								actions={[
									<Tooltip label="Ajouter à un marque-page">
										<span>
											<AddIcon onClick={() => {}} color="black" />
										</span>
									</Tooltip>,
									<Tooltip label="Supprimer du marque-page">
										<span>
											<CloseIcon onClick={() => unlikeArticle(article.Id)} color="black" />
										</span>
									</Tooltip>,
								]}
								likes={article.Likes.length}
							/>
						</GridItem>
					))}
			</Grid> */}
		</VStack>
	);
};

export default MarquePage;
