import * as React from 'react';
import { useState, useEffect } from 'react';
import { /* CircularProgress, */ Grid, GridItem, Stack, Tag, VStack, useDisclosure } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';

import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { Article, OfflineArticle } from 'types/article';
import { Anthology, OfflineAnthology } from 'types/anthology';
import SearchInput from 'components/Inputs/SearchInput';
import AnthologyModal from 'components/modals/Anthology';
import AnthologyCard from 'components/Cards/AnthologyCard';

const Library = (): JSX.Element => {
	const ui = useUIContext();
	const user = useUserContext();
	const offlineUser = useOfflineUserContext();
	const createModal = useDisclosure();
	const updateModal = useDisclosure();
	const [search, setSearch] = useState('');
	const [refresh, setRefresh] = useState(1);

	// online
	const [onlineAnthologies, setOnlineAnthologies] = useState<Anthology[]>([]);
	const [onlineLikedArticles, setOnlineLikedArticles] = useState<Article[]>([]);
	const [onlineAnthologyToUpdate, setOnlineAnthologyToUpdate] = useState<Anthology | undefined>(undefined);

	// offline
	const [offlineAnthologies, setOfflineAnthologies] = useState<OfflineAnthology[]>([]);
	const [offlineLikedArticles, setOfflineLikedArticles] = useState<OfflineArticle[]>([]);
	const [offlineAnthologyToUpdate, setOfflineAnthologyToUpdate] = useState<OfflineAnthology | undefined>(undefined);

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.anthologies.search.many({ author: 'me', query: search }, setOnlineAnthologies);
			ui.online.articles.search.likedPublications({}, setOnlineLikedArticles);
		} else {
			setOfflineAnthologies(
				offlineUser.data.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)),
			);
			setOfflineLikedArticles(offlineUser.data.articles.liked);
		}
	}, [refresh]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!user.data.isOffline) {
				ui.online.anthologies.search.many({ author: 'me', query: search }, setOnlineAnthologies);
			} else {
				// TODO: filter in UI context ?
				setOfflineAnthologies(
					offlineUser.data.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)),
				);
			}
		}, 0.7 * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [search]);

	// if (!user.data.isOffline ? !onlineAnthologies : !offlineAnthologies) {
	// 	return (
	// 		<>
	// 			<VStack w="100%" h="100vh" justify="center">
	// 				<CircularProgress size="120px" isIndeterminate color="black" />
	// 			</VStack>
	// 		</>
	// 	);
	// }

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<Stack direction={{ base: 'column', md: 'row' }} w="100%" align="center">
					<SearchInput
						value={search}
						inputId="bookmarks-search-input"
						w={{ base: '100%', xl: '640px' }}
						placeholder="Cherchez parmis vos dossiers"
						onChange={(e) => setSearch(e.target.value)}
						variant="primary-1"
					/>
					<PlusSquareIcon cursor="pointer" boxSize={8} color="primary.yellow" onClick={createModal.onOpen} />
				</Stack>
				<Tag bg="primary.yellow">
					{!user.data.isOffline
						? `${onlineAnthologies.length} dossier${onlineAnthologies.length === 1 ? '' : 's'}`
						: `${offlineAnthologies.length} dossier${offlineAnthologies.length === 1 ? '' : 's'}`}
				</Tag>
				<Grid
					templateColumns={{
						base: 'repeat(1, 1fr)',
						md: 'repeat(2, minmax(0, 1fr));',
						lg: 'repeat(3, minmax(0, 1fr));',
					}}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					<GridItem>
						<AnthologyCard
							navigateUrl={'/bibliotheque/favoris'}
							name="Favoris"
							description="Tous les articles que vous avez aimé"
							nbArticles={!user.data.isOffline ? onlineLikedArticles.length : offlineLikedArticles.length}
						/>
					</GridItem>
					{!user.data.isOffline
						? onlineAnthologies.map((anthology, index) => (
								<GridItem key={index.toString()}>
									<AnthologyCard
										navigateUrl={`/bibliotheque/dossiers/${anthology.id}`}
										name={anthology.name}
										description={anthology.description}
										// TODO: number of articles
										nbArticles={0}
										deleteAnthology={async () =>
											await ui.online.anthologies.delete(anthology.id, () => setRefresh((r) => r + 1))
										}
										setAnthologyToUpdate={() => setOnlineAnthologyToUpdate(anthology)}
										onOpen={updateModal.onOpen}
									/>
								</GridItem>
						  ))
						: offlineUser.data.anthologies
								.filter((b) => (search !== '' ? b.name.includes(search) : true))
								.map((anthology, index) => (
									<GridItem key={index.toString()}>
										<AnthologyCard
											navigateUrl={`/bibliotheque/dossiers/${anthology.id}`}
											name={anthology.name}
											description={anthology.description}
											nbArticles={anthology.articles.length}
											deleteAnthology={() =>
												ui.offline.anthologies.delete(anthology.id, () => setRefresh((r) => r + 1))
											}
											setAnthologyToUpdate={() => setOfflineAnthologyToUpdate(anthology)}
											onOpen={updateModal.onOpen}
										/>
									</GridItem>
								))}
				</Grid>
			</VStack>

			{(onlineAnthologyToUpdate || offlineAnthologyToUpdate) && (
				<AnthologyModal
					isOpen={updateModal.isOpen}
					onClose={updateModal.onClose}
					type={'UPDATE'}
					action={async (name: string, description: string) => {
						!user.data.isOffline
							? await ui.online.anthologies.update(onlineAnthologyToUpdate!.id, name, description, () => {
									updateModal.onClose();
									setOnlineAnthologyToUpdate(undefined);
									setRefresh((r) => r + 1);
							  })
							: ui.offline.anthologies.update(offlineAnthologyToUpdate!.id, name, description, () => {
									updateModal.onClose();
									setOfflineAnthologyToUpdate(undefined);
							  });
					}}
					name={!user.data.isOffline ? onlineAnthologyToUpdate!.name : offlineAnthologyToUpdate!.name}
					description={
						!user.data.isOffline ? onlineAnthologyToUpdate!.description : offlineAnthologyToUpdate!.description
					}
				/>
			)}
			<AnthologyModal
				isOpen={createModal.isOpen}
				onClose={createModal.onClose}
				type={'CREATE'}
				action={async (name: string, description: string) => {
					!user.data.isOffline
						? await ui.online.anthologies.create({ name, description, isPublic: false }, () => {
								createModal.onClose();
								setRefresh((r) => r + 1);
						  })
						: ui.offline.anthologies.create({
								params: { name, description },
								callback: () => createModal.onClose(),
						  });
				}}
				name={''}
				description={''}
			/>
		</>
	);
};

export default Library;
