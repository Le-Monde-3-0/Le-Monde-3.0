import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';

const ArticleCard = ({
	id,
	title,
	author,
	date,
	topic,
	content,
	actions,
	likes,
	view = 'reader',
}: {
	id: number;
	title: string;
	author: string;
	date: string;
	topic: string;
	content: string;
	actions: JSX.Element[];
	likes: number;
	view?: 'publisher' | 'reader';
}): JSX.Element => {
	const navigate = useNavigate();

	return (
		<VStack
			w="100%"
			h="100%"
			p={{ base: '8px', xl: '16px' }}
			bg="gray.200"
			borderRadius="sm"
			justify="space-between"
			spacing="16px"
		>
			<VStack w="100%" spacing={{ base: '8px', lg: '16px' }}>
				<HStack w="100%" alignItems="center" justifyContent="space-between">
					<HStack>
						<Badge colorScheme="red" borderRadius="xsm">
							{topic}
						</Badge>
						<Badge colorScheme="green" borderRadius="xsm">
							{likes} like{likes !== 1 && 's'}
						</Badge>
					</HStack>
					<HStack spacing="8px">
						{actions.map((action, index) => (
							<Box cursor="pointer" key={`${index.toString()}`}>
								{action}
							</Box>
						))}
					</HStack>
				</HStack>
				<VStack w="100%" align="start" spacing="0px">
					<Text variant="h6" color="black !important">
						{title}
					</Text>
					<Text variant="info" color="black !important">
						{date}
					</Text>
				</VStack>
				{view === 'reader' && (
					<HStack w="100%" justifyContent="space-between">
						<VStack align="start" spacing="0px">
							<Text variant="info" color="black !important">
								Publié par
							</Text>
							<Text variant="link" color="black !important">
								{author}
							</Text>
						</VStack>
						<Button variant="primary-orange" w="fit-content" isDisabled>
							Suivre
						</Button>
					</HStack>
				)}
				<VStack id="testest" w="100%" align="left" spacing="8px" inlineSize="100%" maxInlineSize="calc(100vw - 32px);">
					<Text variant="p" noOfLines={3} color="black !important" maxW="100% !important">
						{content}
					</Text>
				</VStack>
			</VStack>
			<Flex direction="row-reverse" w="100%">
				<Text
					variant="link"
					cursor="pointer"
					color="black !important"
					onClick={() => navigate(`/articles/${id.toString()}`)}
				>
					Lire la suite
				</Text>
			</Flex>
		</VStack>
	);
};

export default ArticleCard;
