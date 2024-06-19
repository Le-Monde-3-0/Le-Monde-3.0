import { useEffect, useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Badge,
	Button,
	CircularProgress,
	Grid,
	GridItem,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Tag,
	Text,
	Tooltip,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import SearchInput from 'components/Inputs/SearchInput';

const Dossiers = (): JSX.Element => {
	const navigate = useNavigate();
	const { requestResponseToast } = useUIContext();
	const { user, createAnthology, deleteAnthology, loadAnthologies, updateAnthology } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [action, setAction] = useState<'create' | 'update'>('create');
	const [bookmarkIdToUpdate, setBookmarkIdToUpdate] = useState<number | undefined>(undefined);

	const uiLoadAnthologies = async () => {
		try {
			const res = await loadAnthologies();
			requestResponseToast(res);
		} catch (error) {
			console.error(error);
		}
	};

	const uiCreateAnthology = async () => {
		try {
			const res = await createAnthology({ name: title, description, isPublic: false });
			requestResponseToast(res, true);
			if (res.status === 'success') {
				onClose();
				setTitle('');
				setDescription('');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiDeleteAnthology = async (id: number) => {
		try {
			const res = await deleteAnthology(id);
			requestResponseToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiUpdateAnthology = async (id: number) => {
		try {
			const res = await updateAnthology({ id, newName: title, newDescription: description });
			requestResponseToast(res, true);
			if (res.status === 'success') {
				onClose();
				setTitle('');
				setDescription('');
				setAction('create');
				setBookmarkIdToUpdate(undefined);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiLoadAnthologies();
	}, []);

	if (!user.anthologies) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="yellow" />
				</VStack>
			</>
		);
	}

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
					{user.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length} marque-page
					{user.anthologies.filter((b) => (search !== '' ? b.name.includes(search) : true)).length !== 1 && 's'}
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
					{user.anthologies
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
														setTitle(anthology.name);
														setDescription(anthology.description);
														setBookmarkIdToUpdate(anthology.id);
														setAction('update');
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

			<Modal
				isOpen={isOpen}
				onClose={() => {
					setTitle('');
					setDescription('');
					setAction('create');
					setBookmarkIdToUpdate(undefined);
					onClose();
				}}
			>
				<ModalOverlay />
				<ModalContent bg="gray.900">
					<ModalHeader color="white">
						{action === 'create' ? 'Nouveau marque-page' : 'Modification du marque-page'}
					</ModalHeader>
					<ModalCloseButton color="white" />
					<ModalBody>
						<VStack spacing="8px">
							<Input
								variant="primary-1"
								bg="gray.700"
								placeholder="Titre du marque-page"
								onChange={(e) => setTitle(e.target.value)}
								value={title}
							/>
							<Input
								variant="primary-1"
								bg="gray.700"
								placeholder="Description du marque-page"
								onChange={(e) => setDescription(e.target.value)}
								value={description}
							/>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button
							variant="primary-yellow"
							onClick={() => {
								if (action === 'create') {
									uiCreateAnthology();
								} else {
									uiUpdateAnthology(bookmarkIdToUpdate!);
								}
							}}
						>
							{action === 'create' ? 'Créer' : 'Modifier'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Dossiers;
