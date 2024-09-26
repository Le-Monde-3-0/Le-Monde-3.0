import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, CircularProgress, HStack, Text, Tooltip, useDisclosure, VStack } from '@chakra-ui/react';
import { FcLikePlaceholder } from 'react-icons/fc';
import { FaFolderPlus } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';

import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { Anthology, OfflineAnthology } from 'types/anthology';
import { Article, OfflineArticle } from 'types/article';
import frenchDate from 'utils/frenchDate';
import AnthologiesModal from 'components/modals/Anthologies';

// TODO: redirect if wrong ID
const ArticlePage = (): JSX.Element => {
	const ui = useUIContext();
	const user = useUserContext();
	const offlineUser = useOfflineUserContext();
	const { articleId } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLiked, setIsLiked] = useState(false);
	const [refresh, setRefresh] = useState(1);

	// online
	const [onlineArticle, setOnlineArticle] = useState<Article | undefined>(undefined);
	const [onlineAnthologies, setOnlineAnthologies] = useState<Anthology[]>([]);
	const [onlineLikedArticles, setOnlineLikedArticles] = useState<Article[]>([]);

	// offline
	const [offlineArticle, setOfflineArticle] = useState<OfflineArticle | undefined>(undefined);
	const [offlineContent, setOfflineContent] = useState('');
	const [offlineAnthologies, setOfflineAnthologies] = useState<OfflineAnthology[]>([]);
	const [offlineLikedArticles, setOfflineLikedArticles] = useState<OfflineArticle[]>([]);

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.articles.search.likedPublications({}, setOnlineLikedArticles);
			ui.online.anthologies.search.many({ author: 'me' }, setOnlineAnthologies);
			ui.online.articles.search.onePublication(+articleId!, setOnlineArticle);
		} else {
			ui.offline.articles.search.one(articleId!, setOfflineArticle);
			ui.offline.articles.getContent(articleId!, setOfflineContent);
			setOfflineAnthologies(offlineUser.data.anthologies);
			setOfflineLikedArticles(offlineUser.data.articles.liked);
		}
	}, [refresh]);

	useEffect(() => {
		if (!user.data.isOffline) {
			setIsLiked(onlineLikedArticles.find((a) => a.id === +articleId!) !== undefined);
		} else {
			setIsLiked(offlineLikedArticles.find((a) => a.cid === articleId) !== undefined);
		}
	}, [onlineArticle, offlineArticle]);

	if (!user.data.isOffline ? !onlineArticle : !offlineArticle) {
		return (
			<VStack w="100%" h="100vh" justify="center">
				<CircularProgress size="120px" isIndeterminate color="black" />
			</VStack>
		);
	}

	return (
		<>
			<VStack align="center" w="100%">
				<VStack w="100%" maxW="720px" justify="center" spacing={{ base: '24px', md: '32px', lg: '40px' }} align="start">
					<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
						<HStack w="100%" justify="flex-end" spacing="16px">
							{isLiked ? (
								<Tooltip label="Retirer des favoris">
									<span>
										<FcLike
											cursor="pointer"
											onClick={async () =>
												!user.data.isOffline
													? await ui.online.articles.like({ id: +articleId!, isLiked }, setIsLiked)
													: ui.offline.articles.like(articleId!, isLiked, setIsLiked)
											}
											size="24px"
										/>
									</span>
								</Tooltip>
							) : (
								<Tooltip label="Ajouter aux favoris">
									<span>
										<FcLikePlaceholder
											onClick={async () =>
												!user.data.isOffline
													? await ui.online.articles.like({ id: +articleId!, isLiked }, setIsLiked)
													: ui.offline.articles.like(articleId!, isLiked, setIsLiked)
											}
											size="24px"
										/>
									</span>
								</Tooltip>
							)}
							<Tooltip label="Ajouter à un dossier">
								<span>
									<FaFolderPlus onClick={onOpen} color="white" size="24px" />
								</span>
							</Tooltip>
						</HStack>
						<VStack align="left" spacing="0px" w="100%">
							<Text variant="h3">{user.data.isOffline ? offlineArticle!.title : onlineArticle!.title}</Text>
							<HStack>
								// TODO: topic ? Or nothing
								<Badge colorScheme="red" fontSize={{ base: 'small', lg: 'md' }} borderRadius="xsm">
									{user.data.isOffline ? `Topic #${offlineArticle!.topicId}` : `Topic #${onlineArticle!.topicId}`}
								</Badge>
								{!user.data.isOffline && (
									<>
										<Badge
											colorScheme="green"
											fontSize={{ base: 'small', lg: 'md' }}
											borderRadius="xsm"
											cursor={'pointer'}
										>
											{onlineArticle!.likeCounter} like{onlineArticle!.likeCounter !== 1 && 's'}
										</Badge>
										<Badge
											colorScheme="blue"
											fontSize={{ base: 'small', lg: 'md' }}
											borderRadius="xsm"
											cursor="pointer"
										>
											{onlineArticle!.viewCounter} view{onlineArticle!.viewCounter !== 1 && 's'}
										</Badge>
									</>
								)}
							</HStack>
						</VStack>
						<Text variant="p" whiteSpace="pre-line" textAlign="justify">
							{user.data.isOffline ? offlineContent : onlineArticle!.content}
						</Text>
					</VStack>
					<VStack align="left" spacing="0px" w="100%">
						// TODO: name author
						<Text variant="h6">
							Écrit par {user.data.isOffline ? offlineArticle!.authorId : onlineArticle!.authorId}
						</Text>
						<Text variant="p">
							{frenchDate(new Date(user.data.isOffline ? offlineArticle!.createdAt : onlineArticle!.createdAt))}
						</Text>
					</VStack>
				</VStack>
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
					await ui.online.anthologies.addArticle(id, onlineArticle!.id, async () => {
						onClose();
						setRefresh((r) => r + 1);
					})
				}
				offlineAction={(id: string) =>
					ui.offline.anthologies.addArticle(id, offlineArticle!.cid, () => {
						onClose();
						setRefresh((r) => r + 1);
					})
				}
			/>
		</>
	);
};

export default ArticlePage;
