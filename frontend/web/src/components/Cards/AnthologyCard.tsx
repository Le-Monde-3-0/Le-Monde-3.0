import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, HStack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const AnthologyCard = ({
	navigateUrl,
	name,
	description,
	nbArticles,
	deleteAnthology,
	setAnthologyToUpdate,
	setType,
	onOpen,
}: {
	navigateUrl: string;
	name: string;
	description: string;
	nbArticles: number;
	deleteAnthology?: () => void;
	setAnthologyToUpdate?: () => void;
	setType?: (t: 'CREATE' | 'UPDATE') => void;
	onOpen?: () => void;
}): JSX.Element => {
	const navigate = useNavigate();

	return (
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
					{nbArticles} article{nbArticles !== 1 && 's'}
				</Badge>
				<Text
					variant="h6"
					color="black !important"
					cursor="pointer"
					_hover={{ opacity: '0.8' }}
					onClick={() => navigate(navigateUrl)}
				>
					{name}
				</Text>
				<Text variant="p" color="black !important">
					{description}
				</Text>
			</VStack>
			{deleteAnthology && setAnthologyToUpdate && onOpen && setType && (
				<HStack>
					<Tooltip label="Modifier le marque-page">
						<span>
							<EditIcon
								onClick={() => {
									setAnthologyToUpdate();
									setType('UPDATE');
									onOpen();
								}}
								color="black"
							/>
						</span>
					</Tooltip>
					<Tooltip label="Supprimer le marque-page">
						<span>
							<DeleteIcon onClick={deleteAnthology} color="black" />
						</span>
					</Tooltip>
				</HStack>
			)}
		</HStack>
	);
};

export default AnthologyCard;
