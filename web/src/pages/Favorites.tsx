import * as React from 'react';
import { useEffect, useState } from 'react';
import { Grid, GridItem, HStack, Text, Tooltip, VStack, useDisclosure } from '@chakra-ui/react';
import { FaFolderPlus } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';

import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { Article, OfflineArticle } from 'types/article';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import AnthologiesModal from 'components/modals/Anthologies';
import { Anthology, OfflineAnthology } from 'types/anthology';

const Favorites = (): JSX.Element => {
	const ui = useUIContext();
	const user = useUserContext();
	const offlineUser = useOfflineUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [refresh, setRefresh] = useState(1);

	// online
	const [onlineAnthologies, setOnlineAnthologies] = useState<Anthology[]>([]);
	const [onlineLikedArticles, setOnlineLikedArticles] = useState<Article[]>([]);
	const [onlineArticleToAdd, setOnlineArticleToAdd] = useState<number | undefined>(undefined);

	// offline
	const [offlineAnthologies, setOfflineAnthologies] = useState<OfflineAnthology[]>([]);
	const [offlineLikedArticles, setOfflineLikedArticles] = useState<OfflineArticle[]>([]);
	const [offlineArticleToAdd, setOfflineArticleToAdd] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.anthologies.search.many({ author: 'me' }, setOnlineAnthologies);
			ui.online.articles.search.likedPublications({ query: search }, setOnlineLikedArticles);
		} else {
			setOfflineAnthologies(offlineUser.data.anthologies);
			setOfflineLikedArticles(
				offlineUser.data.articles.liked.filter((a) => (search !== '' ? a.title.includes(search) : true)),
			);
		}
	}, [refresh]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!user.data.isOffline) {
				ui.online.articles.search.likedPublications({ query: search }, setOnlineLikedArticles);
			} else {
				// TODO: filter in UI context ?
				setOfflineLikedArticles(
					offlineUser.data.articles.liked.filter((a) => (search !== '' ? a.title.includes(search) : true)),
				);
			}
		}, 0.7 * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [search]);

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<SearchInput
					value={search}
					inputId="favoris-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<HStack>
					<Text variant="h5">
						{!user.data.isOffline
							? `Favori ${onlineLikedArticles.length === 1 ? '' : 's'}`
							: `Favori ${offlineLikedArticles.length === 1 ? '' : 's'}`}
					</Text>
					<Text
						variant="h5"
						bg="primary.yellow"
						color="gray.900 !important"
						fontWeight="black"
						p="0px 8px"
						borderRadius="md"
					>
						{!user.data.isOffline ? onlineLikedArticles.length : offlineLikedArticles.length}
					</Text>
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
						? onlineLikedArticles.map((article, index) => (
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
											<Tooltip label="Supprimer des favoris">
												<span>
													<FcLike
														onClick={async () =>
															await ui.online.articles.like({ id: article.id, isLiked: true }, () =>
																setRefresh((r) => r + 1),
															)
														}
													/>
												</span>
											</Tooltip>,
										]}
										likes={article.likeCounter}
										views={article.viewCounter}
									/>
								</GridItem>
						  ))
						: offlineUser.data.articles.liked.map((article, index) => (
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
														color="white"
													/>
												</span>
											</Tooltip>,
											<Tooltip label="Supprimer des favoris">
												<span>
													<FcLike
														onClick={() => ui.offline.articles.like(article.cid, true, () => setRefresh((r) => r + 1))}
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

export default Favorites;
