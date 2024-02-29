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
	useToast,
} from '@chakra-ui/react';
import { useAuthContext } from 'contexts/auth';

import Bookmark from 'types/bookmark';
import services from 'services';
import { AxiosError } from 'axios';
import SearchInput from 'components/Inputs/SearchInput';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const MarquePages = (): JSX.Element => {
	const toast = useToast();
	const navigate = useNavigate();
	const { auth } = useAuthContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [bookmarks, setBookmarks] = useState<Bookmark[] | undefined>(undefined);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [action, setAction] = useState<'create' | 'update'>('create');
	const [bookmarkIdToUpdate, setBookmarkIdToUpdate] = useState<number | undefined>(undefined);

	const getBookmarks = async () => {
		try {
			const res = await services.bookmarks.getAll({ token: auth.accessToken! });
			console.log(res.data);
			setBookmarks(res.data);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					console.log(status);
				} else {
					toast({
						title: 'Erreur du service interne.',
						description: 'Veuillez réessayer ultérieurement.',
						status: 'error',
						duration: 9000,
						isClosable: true,
					});
				}
			}
		}
	};

	const createBookmark = async () => {
		try {
			const res = await services.bookmarks.create({ token: auth.accessToken!, title, description });
			console.log(res.data);
			toast({
				title: 'Votre marque-page a été créé !',
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			onClose();
			setTitle('');
			setDescription('');
			setBookmarks([res.data, ...bookmarks!]);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					if (status === 400) {
						toast({
							title: 'Paramètres invalides.',
							description: 'Veuillez en renseigner de nouveaux.',
							status: 'error',
							duration: 9000,
							isClosable: true,
						});
					}
				} else {
					toast({
						title: 'Erreur du service interne.',
						description: 'Veuillez réessayer ultérieurement.',
						status: 'error',
						duration: 9000,
						isClosable: true,
					});
				}
			}
		}
	};

	const hardDelete = async (bookmarkId: number) => {
		try {
			const res = await services.bookmarks.delete({ token: auth.accessToken!, bookmarkId });
			console.log(res);
			setBookmarks([...bookmarks!.filter((p) => p.Id !== bookmarkId)]);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					console.log(status);
				} else {
					toast({
						title: 'Erreur du service interne.',
						description: 'Veuillez réessayer ultérieurement.',
						status: 'error',
						duration: 9000,
						isClosable: true,
					});
				}
			}
		}
	};

	const updateBookmark = async (bookmarkId: number) => {
		try {
			const res = await services.bookmarks.update({ token: auth.accessToken!, bookmarkId, title, description });
			console.log(res.data);
			toast({
				title: 'Votre marque-page a été modifié !',
				status: 'success',
				duration: 9000,
				isClosable: true,
			});
			onClose();
			setTitle('');
			setDescription('');
			setAction('create');
			setBookmarkIdToUpdate(undefined);
			setBookmarks([res.data, ...bookmarks!.filter((b) => b.Id !== bookmarkId)]);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				if (error.response && error.response.status !== 500) {
					const status = error.response!.status;
					if (status === 400) {
						toast({
							title: 'Paramètres invalides.',
							description: 'Veuillez en renseigner de nouveaux.',
							status: 'error',
							duration: 9000,
							isClosable: true,
						});
					}
				} else {
					toast({
						title: 'Erreur du service interne.',
						description: 'Veuillez réessayer ultérieurement.',
						status: 'error',
						duration: 9000,
						isClosable: true,
					});
				}
			}
		}
	};

	useEffect(() => {
		if (auth.accessToken) {
			getBookmarks();
		}
	}, [auth]);

	if (!bookmarks) {
		return (
			<>
				<VStack w="100%" h="100vh" justify="center">
					<CircularProgress size="120px" isIndeterminate color="black" />
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
				<Tag bg="yellow">
					{bookmarks.filter((b) => (search !== '' ? b.Title.includes(search) : true)).length} marque-page
					{bookmarks.filter((b) => (search !== '' ? b.Title.includes(search) : true)).length !== 1 && 's'}
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
					{bookmarks
						.filter((b) => (search !== '' ? b.Title.includes(search) : true))
						.map((bookmark, index) => (
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
										<Badge colorScheme="green" borderRadius="xsm">
											{bookmark.Articles.length} article{bookmark.Articles.length !== 1 && 's'}
										</Badge>
										<Text
											variant="h6"
											color="black !important"
											cursor="pointer"
											_hover={{ opacity: '0.8' }}
											onClick={() => navigate(`/marque-page/${bookmark.Id}`)}
										>
											{bookmark.Title}
										</Text>
										<Text variant="p" color="black !important">
											{bookmark.Description}
										</Text>
									</VStack>
									<HStack>
										<Tooltip label="Modifier le marque-page">
											<span>
												<EditIcon
													onClick={() => {
														setTitle(bookmark.Title);
														setDescription(bookmark.Description);
														setBookmarkIdToUpdate(bookmark.Id);
														setAction('update');
														onOpen();
													}}
													color="black"
												/>
											</span>
										</Tooltip>
										<Tooltip label="Supprimer le marque-page">
											<span>
												<DeleteIcon onClick={() => hardDelete(bookmark.Id)} color="black" />
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
									createBookmark();
								} else {
									updateBookmark(bookmarkIdToUpdate!);
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

export default MarquePages;
