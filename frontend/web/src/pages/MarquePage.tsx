import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { CircularProgress, Grid, GridItem, Tag, Tooltip, VStack } from '@chakra-ui/react';

import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import { useAuthContext } from 'contexts/auth';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import { Bookmark } from 'types/bookmark';
import { Article } from 'types/article';

const MarquePage = (): JSX.Element => {
	const navigate = useNavigate();
	const { auth } = useAuthContext();
	const { requestResponseToast } = useUIContext();
	const { getBookmark, getBookmarkArticles, removeArticleFromBookmark } = useUserContext();
	const { bookmarkId } = useParams();
	const [search, setSearch] = useState('');
	const [bookmark, setBookmark] = useState<Bookmark | undefined>(undefined);
	const [articles, setArticles] = useState<Article[]>([]);

	const uiGetBookmark = async () => {
		try {
			const res = await getBookmark(+bookmarkId!);
			requestResponseToast(res);
			if (res.code === 404) {
				navigate('/marque-pages');
			} else if (res.status === 'success') {
				setBookmark(res.data!.Articles === null ? { ...res.data!, Articles: [] } : res.data!);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiGetBookmarkArticles = async () => {
		try {
			const res = await getBookmarkArticles(+bookmarkId!);
			requestResponseToast(res);
			if (res.code === 404) {
				navigate('/marque-pages');
			} else if (res.status === 'success') {
				if (res.data === null) setArticles([]);
				else setArticles(res.data!);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiRemoveArticleFromBookmark = async (articleId: number) => {
		try {
			const res = await removeArticleFromBookmark(+bookmarkId!, articleId);
			requestResponseToast(res, true);
			if (res.status === 'success') {
				setBookmark((b) => ({ ...b!, Articles: b!.Articles.filter((a) => a !== articleId) }));
				setArticles(articles.filter((a) => a.Id !== articleId));
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiGetBookmark();
		console.log(bookmark);
		uiGetBookmarkArticles();
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
			<Tag bg="primary.yellow">
				{bookmark.Articles.length} article
				{bookmark.Articles.length !== 1 && 's'}
			</Tag>
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
											<CloseIcon onClick={() => uiRemoveArticleFromBookmark(article.Id)} color="black" />
										</span>
									</Tooltip>,
								]}
								likes={article.Likes.length}
								views={article.TotalViews}
							/>
						</GridItem>
					))}
			</Grid>
		</VStack>
	);
};

export default MarquePage;
