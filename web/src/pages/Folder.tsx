import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Grid, GridItem, Tag, Tooltip, VStack } from '@chakra-ui/react';
import { FaFolderMinus } from 'react-icons/fa';

import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import { Article, OfflineArticle } from 'types/article';
import { Anthology, OfflineAnthology } from 'types/anthology';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Folder = (): JSX.Element => {
	const user = useUserContext();
	const ui = useUIContext();
	const { anthologyId } = useParams();
	const [search, setSearch] = useState('');
	const [onlineAnthology, setOnlineAnthology] = useState<Anthology | undefined>(undefined);
	const [offlineAnthology, setOfflineAnthology] = useState<OfflineAnthology | undefined>(undefined);
	const [onlineArticles, setOnlineArticles] = useState<Article[]>([]);
	const [offlineArticles, setOfflineArticles] = useState<OfflineArticle[]>([]);

	useEffect(() => {
		if (user.data.isOffline) {
			ui.offline.anthologies.search.one(anthologyId!, setOfflineAnthology);
			ui.offline.anthologies.articles(anthologyId!, setOfflineArticles);
		} else {
			ui.online.anthologies.search.one(+anthologyId!, setOnlineAnthology);
			ui.online.anthologies.articles(+anthologyId!, setOnlineArticles);
		}
	}, []);

	if (user.data.isOffline ? !offlineAnthology : !onlineAnthology) {
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
				{user.data.isOffline
					? // TODO: find a better way
					  // ? `${offlineAnthology!.articles.length} article${offlineAnthology!.articles.length === 1 ? '' : 's'}`
					  `${offlineArticles.length} article${offlineArticles.length === 1 ? '' : 's'}`
					: `${onlineArticles.length} article${onlineArticles.length === 1 ? '' : 's'}`}
			</Tag>
			<Grid
				templateColumns={{
					base: 'repeat(1, 1fr)',
					md: 'repeat(2, minmax(0, 1fr));',
					'2xl': 'repeat(3, minmax(0, 1fr));',
				}}
				gap={{ base: 2, lg: 4 }}
				w="100%"
			>
				{user.data.isOffline
					? offlineArticles
							.filter((a) => (search !== '' ? a.title.includes(search) : true))
							.map((article, index) => (
								<GridItem key={index.toString()}>
									<ArticleCard
										navigateUrl={`/articles/${article.cid}`}
										title={article.title}
										// TODO: author name ? Or nothing
										author={`Author #${article.authorId}`}
										date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
										// TODO: Topic name ? Or nothing
										topic={`Topic #${article.topicId}`}
										content={article.preview || ''}
										actions={[
											// TODO: add article to other anthology
											// <Tooltip label="Ajouter à un dossier">
											// 	<span>
											// 		<AddIcon onClick={() => {}} color="black" />
											// 	</span>
											// </Tooltip>,
											<Tooltip label="Supprimer du dossier">
												<span>
													<FaFolderMinus
														onClick={() =>
															ui.offline.anthologies.removeArticle(anthologyId!, article.cid, async () => {
																// await ui.offline.anthologies.articles(anthologyId!, setOfflineArticles);
																// TODO: find a better way
																setOfflineArticles((articles) => articles.filter((a) => a.cid !== article.cid));
															})
														}
														color="white"
													/>
												</span>
											</Tooltip>,
										]}
									/>
								</GridItem>
							))
					: onlineArticles
							.filter((a) => (search !== '' ? a.title.includes(search) : true))
							.map((article, index) => (
								<GridItem key={index.toString()}>
									<ArticleCard
										navigateUrl={`/articles/${article.id.toString()}`}
										title={article.title}
										// TODO: author name
										author={`Author #${article.authorId}`}
										date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
										// TODO: Topic name
										topic={`Topic #${article.topicId}`}
										content={article.content}
										actions={[
											// TODO: add article to other anthology
											// <Tooltip label="Ajouter à un dossier">
											// 	<span>
											// 		<AddIcon onClick={() => {}} color="black" />
											// 	</span>
											// </Tooltip>,
											<Tooltip label="Supprimer du dossier">
												<span>
													<FaFolderMinus
														onClick={() =>
															ui.online.anthologies.removeArticle(+anthologyId!, article.id, async () => {
																await ui.online.anthologies.articles(+anthologyId!, setOnlineArticles);
															})
														}
														color="white"
													/>
												</span>
											</Tooltip>,
										]}
										likes={article.likeCounter}
										views={article.viewCounter}
									/>
								</GridItem>
							))}
			</Grid>
		</VStack>
	);
};

export default Folder;
