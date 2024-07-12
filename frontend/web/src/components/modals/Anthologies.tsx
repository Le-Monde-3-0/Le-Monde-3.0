import * as React from 'react';
import {
	Badge,
	HStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Text,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';

import { Anthology } from 'types/anthology';
import { AnthologiesCreate } from 'types/services';
import AnthologyModal from './Anthology';

const AnthologiesModal = ({
	isOpen,
	onClose,
	anthologies,
	createAnthology,
	action,
}: {
	isOpen: boolean;
	onClose: () => void;
	anthologies: Anthology[];
	createAnthology: (title: string, description: string) => void;
	action: (id: number) => void;
}) => {
	const createDiscolsure = useDisclosure();
	const createIsOpen = createDiscolsure.isOpen;
	const createOnOpen = createDiscolsure.onOpen;
	const createOnClose = createDiscolsure.onClose;

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg="gray.900">
					<ModalHeader color="white">Dossiers</ModalHeader>
					<ModalCloseButton color="white" />
					<ModalBody>
						<Text variant="p" mb="8px">
							{anthologies.length} dossier{anthologies.length !== 1 && 's'}
						</Text>
						<VStack spacing="8px" mb="12px">
							<HStack
								w="100%"
								align="baseline"
								justify="space-between"
								p={{ base: '8px', xl: '16px' }}
								bg="gray.200"
								borderRadius="sm"
								cursor="pointer"
								_hover={{ opacity: 0.9 }}
								onClick={() => createOnOpen()}
							>
								<Text variant="link" color="black !important" cursor="pointer" _hover={{ opacity: '0.8' }}>
									Nouveau dossier
								</Text>
							</HStack>
							{anthologies.map((anthology, index) => (
								<HStack
									key={`${index.toString()}`}
									w="100%"
									align="baseline"
									justify="space-between"
									p={{ base: '8px', xl: '16px' }}
									bg="gray.200"
									borderRadius="sm"
									cursor="pointer"
									_hover={{ opacity: 0.9 }}
									onClick={() => action(anthology.id)}
								>
									<Text variant="link" color="black !important" cursor="pointer" _hover={{ opacity: '0.8' }}>
										{anthology.name}
									</Text>
									// TODO: nombre d'articles
									<Badge colorScheme="green" borderRadius="xsm">
										x articles
									</Badge>
								</HStack>
							))}
						</VStack>
					</ModalBody>
				</ModalContent>
				<ModalFooter></ModalFooter>
			</Modal>

			<AnthologyModal
				isOpen={createIsOpen}
				onClose={createOnClose}
				type="CREATE"
				action={(title, description) => {
					createAnthology(title, description);
					// TODO: create modal closes even if action failed
					createOnClose();
				}}
			/>
		</>
	);
};

export default AnthologiesModal;
