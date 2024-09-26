import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, GridItem, HStack, Select, Tooltip, VStack, useDisclosure } from '@chakra-ui/react';
import { FaFolderPlus } from 'react-icons/fa';

import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { Topic } from 'types/topic';
import { Article, OfflineArticle } from 'types/article';
import { Anthology, OfflineAnthology } from 'types/anthology';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import AnthologiesModal from 'components/modals/Anthologies';

// TODO: improve online search
// TODO: articles should be likable / unlikable here
const Explore = (): JSX.Element => {
	const ui = useUIContext();
	const user = useUserContext();
	const offlineUser = useOfflineUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [topic, setTopic] = useState<Topic | undefined>();
	const [topics, setTopics] = useState<Topic[]>([]);
	const [refresh, setRefresh] = useState(1);

	// online
	const [onlineArticles, setOnlineArticles] = useState<Article[]>([]);
	const [onlineAnthologies, setOnlineAnthologies] = useState<Anthology[]>([]);
	const [onlineArticleToAdd, setOnlineArticleToAdd] = useState<number | undefined>(undefined);

	// offline
	const [offlineArticles, setOfflineArticles] = useState<OfflineArticle[]>([]);
	const [offlineAnthologies, setOfflineAnthologies] = useState<OfflineAnthology[]>([]);
	const [offlineArticleToAdd, setOfflineArticleToAdd] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.articles.search.allPublications({ query: search, topic: topic?.id }, setOnlineArticles);
			ui.online.anthologies.search.many({ author: 'me' }, setOnlineAnthologies);
			ui.online.topics.search.all(setTopics);
		} else {
			setOfflineArticles(offlineUser.articlesCatalog.filter((a) => (search !== '' ? a.title.includes(search) : true)));
			setOfflineAnthologies(offlineUser.data.anthologies);
		}
	}, [refresh]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!user.data.isOffline) {
				ui.online.articles.search.allPublications({ query: search, topic: topic?.id }, setOnlineArticles);
			} else {
				// TODO: filter in UI context ?
				setOfflineArticles(
					offlineUser.articlesCatalog.filter((a) => (search !== '' ? a.title.includes(search) : true)),
				);
			}
		}, 0.7 * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [search, topic]);

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<HStack>
					<SearchInput
						value={search}
						inputId="favoris-search-input"
						w={{ base: '100%', xl: '640px' }}
						placeholder="Cherchez parmis vos articles favoris"
						onChange={(e) => setSearch(e.target.value)}
						variant="primary-1"
					/>
					{!user.data.isOffline && (
						<Select
							w="25%"
							id="write-topic-input"
							variant="primary-1"
							onChange={(e) => setTopic(topics.find((t) => t.name === e.target.value))}
							value={topic?.name}
							sx={{
								'> option': {
									background: '#212529',
								},
							}}
						>
							{topics.map((t, index) => (
								<option key={index}>{t.name}</option>
							))}
						</Select>
					)}
				</HStack>
				<Grid
					templateColumns={{
						base: 'repeat(1, 1fr)',
						md: 'repeat(2, minmax(0, 1fr));',
						'2xl': 'repeat(3, minmax(0, 1fr));',
					}}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{!user.data.isOffline
						? onlineArticles
								.filter((a) => (search !== '' ? a.title.includes(search) : true))
								.map((article, index) => (
									<GridItem key={index.toString()}>
										<ArticleCard
											navigateUrl={`/articles/${article.id}`}
											title={article.title}
											// TODO: author name
											author={`Author #${article.authorId}`}
											date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
											// TODO: topic name
											topic={`Topic #${article.topicId}`}
											content={article.content}
											actions={[
												<Tooltip label="Ajouter à un dossier">
													<span>
														<FaFolderPlus
															onClick={() => {
																setOnlineArticleToAdd(article.id);
																onOpen();
															}}
															color="white"
														/>
													</span>
												</Tooltip>,
											]}
											likes={article.likeCounter}
											views={article.viewCounter}
										/>
									</GridItem>
								))
						: offlineArticles.map((article, index) => (
								<GridItem key={index.toString()}>
									<ArticleCard
										navigateUrl={`/articles/${article.cid}`}
										title={article.title}
										// TODO: author name ? Or nothing
										author={`Author #${article.authorId}`}
										date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
										// TODO: topic name ? Or nothing
										topic={`Topic #${article.topicId}`}
										content={article.preview || ''}
										actions={[
											<Tooltip label="Ajouter à un dossier">
												<span>
													<FaFolderPlus
														onClick={() => {
															setOfflineArticleToAdd(article.cid);
															onOpen();
														}}
														size="20px"
														color="white"
													/>
												</span>
											</Tooltip>,
										]}
									/>
								</GridItem>
						  ))}
				</Grid>
			</VStack>

			<AnthologiesModal
				isOpen={isOpen}
				onClose={onClose}
				isOffline={user.data.isOffline}
				onlineAnthologies={!user.data.isOffline ? onlineAnthologies : undefined}
				offlineAnthologies={!user.data.isOffline ? undefined : offlineAnthologies}
				createAnthology={async (name: string, description: string) =>
					!user.data.isOffline
						? await ui.online.anthologies.create({ name, description, isPublic: false }, async () => {
								onClose();
								setRefresh((r) => r + 1);
						  })
						: ui.offline.anthologies.create({
								params: { name, description },
								callback: () => {
									onClose();
									setRefresh((r) => r + 1);
								},
						  })
				}
				onlineAction={async (id: number) =>
					await ui.online.anthologies.addArticle(id, onlineArticleToAdd!, async () => {
						onClose();
						setRefresh((r) => r + 1);
					})
				}
				offlineAction={(id: string) =>
					ui.offline.anthologies.addArticle(id, offlineArticleToAdd!, () => {
						onClose();
						setRefresh((r) => r + 1);
					})
				}
			/>
		</>
	);
};

export default Explore;
