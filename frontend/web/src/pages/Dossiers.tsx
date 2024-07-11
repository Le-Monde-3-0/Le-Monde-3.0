import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Badge,
	Button,
	Grid,
	GridItem,
	HStack,
	Stack,
	Tag,
	Text,
	Tooltip,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { useUIContext } from 'contexts/ui';
import { useUserContext } from 'contexts/user';
import { Anthology } from 'types/anthology';
import SearchInput from 'components/Inputs/SearchInput';
import AnthologyModal from 'components/modals/Anthology';

const Dossiers = (): JSX.Element => {
	const navigate = useNavigate();
	const { handleToast } = useUIContext();
	const { data, methods } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [type, setType] = useState<'CREATE' | 'UPDATE'>('CREATE');
	const [anthologyToUpdate, setAnthologyToUpdate] = useState<Anthology | undefined>(undefined);

	const uiCreateAnthology = async (title: string, description: string) => {
		try {
			const res = await methods.anthologies.create({ name: title, description, isPublic: false });
			handleToast(res, true);
			if (res.status === 'success') onClose();
		} catch (error) {
			console.error(error);
		}
	};

	const uiUpdateAnthology = async (title: string, description: string) => {
		try {
			const res = await methods.anthologies.update({
				id: anthologyToUpdate!.id,
				newName: title,
				newDescription: description,
			});
			handleToast(res, true);
			if (res.status === 'success') {
				onClose();
				setType('CREATE');
				setAnthologyToUpdate(undefined);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiDeleteAnthology = async (id: number) => {
		try {
			const res = await methods.anthologies.delete({ id });
			handleToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<Stack direction={{ base: 'column', md: 'row' }} w="100%" justifyContent="flex-start">
					<SearchInput
						value={search}
						inputId="bookmarks-search-input"
						w={{ base: '100%', xl: '640px' }}
						placeholder="Cherchez parmis vos marques-pages"
						onChange={(e) => setSearch(e.target.value)}
						variant="primary-1"
					/>
					<Button variant="secondary-yellow" onClick={onOpen}>
						Nouveau marque-page
					</Button>
				</Stack>
				<Tag bg="primary.yellow">
					{data.user.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length} marque-page
					{data.user.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length !== 1 && 's'}
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
					{data.user.anthologies
						.filter((b) => (search !== '' ? b.name.includes(search) : true))
						.map((anthology, index) => (
							<GridItem key={`${index.toString()}`}>
								<HStack
									w="100%"
									h="100%"
									p={{ base: '8px', xl: '16px' }}
									bg="gray.200"
									borderRadius="sm"
									justifyContent="space-between"
									align="start"
								>
									<VStack align="start" spacing="0px">
										// TODO: number of articles
										<Badge colorScheme="green" borderRadius="xsm">
											x articles
										</Badge>
										<Text
											variant="h6"
											color="black !important"
											cursor="pointer"
											_hover={{ opacity: '0.8' }}
											onClick={() => navigate(`/marque-page/${anthology.id}`)}
										>
											{anthology.name}
										</Text>
										<Text variant="p" color="black !important">
											{anthology.description}
										</Text>
									</VStack>
									<HStack>
										<Tooltip label="Modifier le marque-page">
											<span>
												<EditIcon
													onClick={() => {
														setAnthologyToUpdate(anthology);
														setType('UPDATE');
														onOpen();
													}}
													color="black"
												/>
											</span>
										</Tooltip>
										<Tooltip label="Supprimer le marque-page">
											<span>
												<DeleteIcon onClick={() => uiDeleteAnthology(anthology.id)} color="black" />
											</span>
										</Tooltip>
									</HStack>
								</HStack>
							</GridItem>
						))}
				</Grid>
			</VStack>

			<AnthologyModal
				isOpen={isOpen}
				onClose={onClose}
				type={type}
				action={type === 'CREATE' ? uiCreateAnthology : uiUpdateAnthology}
				title={type === 'CREATE' ? '' : anthologyToUpdate!.name}
				description={type === 'CREATE' ? '' : anthologyToUpdate!.description}
			/>
		</>
	);
};

export default Dossiers;
