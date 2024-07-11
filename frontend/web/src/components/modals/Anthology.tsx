import * as React from 'react';
import { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	VStack,
	Input,
	ModalFooter,
	Button,
} from '@chakra-ui/react';

const AnthologyModal = ({
	isOpen,
	onClose,
	type,
	action,
	title = '',
	description = '',
}: {
	isOpen: boolean;
	onClose: () => void;
	type: 'CREATE' | 'UPDATE';
	action: (title: string, description: string) => void;
	title?: string;
	description?: string;
}) => {
	const [newTitle, setNewTitle] = useState(title);
	const [newDescription, setNewDescription] = useState(description);

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setNewTitle(title);
				setNewDescription(description);
				onClose();
			}}
		>
			<ModalOverlay />
			<ModalContent bg="gray.900">
				<ModalHeader color="white">{type === 'CREATE' ? 'Nouveau dossier' : 'Modification du dossier'}</ModalHeader>
				<ModalCloseButton color="white" />
				<ModalBody>
					<VStack spacing="8px">
						<Input
							variant="primary-1"
							bg="gray.700"
							placeholder="Titre"
							onChange={(e) => setNewTitle(e.target.value)}
							value={newTitle}
						/>
						<Input
							variant="primary-1"
							bg="gray.700"
							placeholder="Description"
							onChange={(e) => setNewDescription(e.target.value)}
							value={newDescription}
						/>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button
						variant="primary-yellow"
						onClick={() => {
							action(newTitle, newDescription);
							// TODO: title and description cleared even if action failed
							setNewTitle('');
							setNewDescription('');
						}}
					>
						{type === 'CREATE' ? 'Créer' : 'Modifier'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AnthologyModal;
