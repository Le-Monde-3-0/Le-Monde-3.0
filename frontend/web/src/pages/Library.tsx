import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, GridItem, Stack, Tag, VStack, useDisclosure } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';

import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { useOfflineUserContext } from 'contexts/offlineUser';
import { Article } from 'types/article';
import { Anthology, OfflineAnthology } from 'types/anthology';
import SearchInput from 'components/Inputs/SearchInput';
import AnthologyModal from 'components/modals/Anthology';
import AnthologyCard from 'components/Cards/AnthologyCard';

const Library = (): JSX.Element => {
	const ui = useUIContext();
	const user = useUserContext();
	const offlineUser = useOfflineUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [type, setType] = useState<'CREATE' | 'UPDATE'>('CREATE');
	const [onlineAnthologies, setOnlineAnthologies] = useState<Anthology[]>([]);
	const [onlineLikedArticles, setOnlineLikedArticles] = useState<Article[]>([]);
	const [onlineAnthologyToUpdate, setOnlineAnthologyToUpdate] = useState<Anthology | undefined>(undefined);
	const [offlineAnthologyToUpdate, setOfflineAnthologyToUpdate] = useState<OfflineAnthology | undefined>(undefined);

	useEffect(() => {
		if (!user.data.isOffline) {
			ui.online.anthologies.load(setOnlineAnthologies);
			ui.online.articles.load.liked(setOnlineLikedArticles);
		}
	}, []);

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
					<PlusSquareIcon cursor="pointer" boxSize={8} color="primary.yellow" onClick={onOpen} />
				</Stack>
				<Tag bg="primary.yellow">
					{/* TODO: use anthologies search */}
					{user.data.isOffline
						? `${
								offlineUser.data.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length
						  } dossier${
								offlineUser.data.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length !==
									1 && 's'
						  }`
						: `${onlineAnthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length} dossier${
								onlineAnthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length !== 1 && 's'
						  }`}
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
							nbArticles={user.data.isOffline ? offlineUser.data.articles.liked.length : onlineLikedArticles.length}
						/>
					</GridItem>
					{user.data.isOffline
						? offlineUser.data.anthologies
								.filter((b) => (search !== '' ? b.name.includes(search) : true))
								.map((anthology, index) => (
									<GridItem key={index.toString()}>
										<AnthologyCard
											navigateUrl={`/bibliotheque/dossiers/${anthology.id}`}
											name={anthology.name}
											description={anthology.description}
											nbArticles={anthology.articles.length}
											deleteAnthology={() => ui.offline.anthologies.delete(anthology.id)}
											setAnthologyToUpdate={() => setOfflineAnthologyToUpdate(anthology)}
											setType={setType}
											onOpen={onOpen}
										/>
									</GridItem>
								))
						: onlineAnthologies
								.filter((b) => (search !== '' ? b.name.includes(search) : true))
								.map((anthology, index) => (
									<GridItem key={index.toString()}>
										<AnthologyCard
											navigateUrl={`/bibliotheque/dossiers/${anthology.id}`}
											name={anthology.name}
											description={anthology.description}
											// TODO: number of articles
											nbArticles={0}
											deleteAnthology={() =>
												ui.online.anthologies.delete(anthology.id, async () => {
													await ui.online.anthologies.load(setOnlineAnthologies);
												})
											}
											setAnthologyToUpdate={() => setOnlineAnthologyToUpdate(anthology)}
											setType={setType}
											onOpen={onOpen}
										/>
									</GridItem>
								))}
				</Grid>
			</VStack>

			<AnthologyModal
				isOpen={isOpen}
				onClose={() => {
					setType('CREATE');
					onClose();
				}}
				type={type}
				action={async (name: string, description: string) => {
					type === 'CREATE'
						? user.data.isOffline
							? await ui.offline.anthologies.create({
									params: { name, description },
									callback: () => {
										onClose();
									},
							  })
							: await ui.online.anthologies.create({
									params: { name, description },
									callback: async () => {
										onClose();
										await ui.online.anthologies.load(setOnlineAnthologies);
									},
							  })
						: user.data.isOffline
						? await ui.offline.anthologies.update(offlineAnthologyToUpdate!.id, name, description, () => {
								onClose();
								setType('CREATE');
								setOfflineAnthologyToUpdate(undefined);
						  })
						: await ui.online.anthologies.update(onlineAnthologyToUpdate!.id, name, description, async () => {
								onClose();
								setType('CREATE');
								setOnlineAnthologyToUpdate(undefined);
								await ui.online.anthologies.load(setOnlineAnthologies);
						  });
				}}
				name={
					type === 'CREATE' ? '' : user.data.isOffline ? offlineAnthologyToUpdate!.name : onlineAnthologyToUpdate!.name
				}
				description={
					type === 'CREATE'
						? ''
						: user.data.isOffline
						? offlineAnthologyToUpdate!.description
						: onlineAnthologyToUpdate!.description
				}
			/>
		</>
	);
};

export default Library;
