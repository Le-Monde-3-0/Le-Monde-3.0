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
import { Anthology } from 'types/anthology';
import { Article, OfflineArticle } from 'types/article';
import frenchDate from 'utils/frenchDate';
import AnthologiesModal from 'components/modals/Anthologies';

const ArticlePage = (): JSX.Element => {
	const user = useUserContext();
	const offlineUser = useOfflineUserContext();
	const ui = useUIContext();
	const { articleId } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [onlineArticle, setOnlineArticle] = useState<Article | undefined>(undefined);
	const [offlineArticle, setOfflineArticle] = useState<OfflineArticle | undefined>(undefined);
	const [offlineContent, setOfflineContent] = useState('');
	const [onlineLikedArticles, setOnlineLikedArticles] = useState<Article[]>([]);
	const [onlineAnthologies, setOnlineAnthologies] = useState<Anthology[]>([]);
	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		if (user.data.isOffline) {
			ui.offline.articles.search.one(articleId!, setOfflineArticle);
			ui.offline.articles.getContent(articleId!, setOfflineContent);
		} else {
			ui.online.articles.load.liked(setOnlineLikedArticles);
			ui.online.anthologies.load(setOnlineAnthologies);
			ui.online.articles.search.one(+articleId!, setOnlineArticle);
		}
	}, []);

	useEffect(() => {
		if (
			user.data.isOffline
				? offlineUser.data.articles.liked.find((a) => a.cid === articleId)
				: onlineLikedArticles.find((a) => a.id === +articleId!)
		) {
			setIsLiked(true);
		}
	}, [onlineArticle, offlineArticle]);

	if (user.data.isOffline ? !offlineArticle : !onlineArticle) {
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
												user.data.isOffline
													? await ui.offline.articles.like(articleId!, isLiked, setIsLiked)
													: await ui.online.articles.like(+articleId!, isLiked, async (newValue) => {
															setIsLiked(newValue);
													  })
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
												user.data.isOffline
													? await ui.offline.articles.like(articleId!, isLiked, setIsLiked)
													: await ui.online.articles.like(+articleId!, isLiked, async (newValue) => {
															setIsLiked(newValue);
													  })
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
				onlineAnthologies={user.data.isOffline ? undefined : onlineAnthologies}
				offlineAnthologies={user.data.isOffline ? offlineUser.data.anthologies : undefined}
				createAnthology={async (name: string, description: string) =>
					user.data.isOffline
						? await ui.offline.anthologies.create({
								params: { name, description, cid: articleId! },
								callback: () => {
									onClose();
								},
						  })
						: await ui.online.anthologies.create({
								params: { name, description, articleId: +articleId! },
								callback: async () => {
									onClose();
									await ui.online.anthologies.load(setOnlineAnthologies);
								},
						  })
				}
				onlineAction={async (id: number) =>
					await ui.online.anthologies.addArticle(id, +articleId!, async () => {
						onClose();
						await ui.online.anthologies.load(setOnlineAnthologies);
					})
				}
				offlineAction={async (id: string) =>
					ui.offline.anthologies.addArticle(id, articleId!, () => {
						onClose();
					})
				}
			/>
		</>
	);
};

export default ArticlePage;
