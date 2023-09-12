import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';

const ArticleCard = ({
	id,
	title,
	author,
	date,
	topic,
	content,
	actions,
}: {
	id: string;
	title: string;
	author: string;
	date: string;
	topic: string;
	content: string;
	actions: JSX.Element[];
}): JSX.Element => {
	const navigate = useNavigate();
	const [triggered, setTriggered] = useState(false);

	return (
		<VStack
			position="relative"
			w="100%"
			h="100%"
			p="4px"
			border="1px solid"
			borderColor="secondary.4"
			borderRadius="sm"
			justify="space-between"
			spacing="16px"
		>
			<VStack w="100%" spacing="8px" mt="16px" px="16px">
				<HStack
					position="absolute"
					top="4px"
					right="4px"
					cursor="pointer"
					borderRadius="sm"
					p="8px"
					backgroundColor="secondary.4"
					backdropBlur="5px"
					onClick={() => setTriggered(!triggered)}
					spacing="4px"
				>
					<Box borderRadius="50%" w="8px" h="8px" backgroundColor="gray.300" />
					<Box borderRadius="50%" w="8px" h="8px" backgroundColor="gray.300" />
					<Box borderRadius="50%" w="8px" h="8px" backgroundColor="gray.300" />
				</HStack>
				{triggered && (
					<VStack
						position="absolute"
						top="32px"
						right="4px"
						p="8px"
						backgroundColor="secondary.4"
						borderRadius="sm"
						align="left"
					>
						{actions.map((action, index) => (
							<HStack cursor="pointer" key={`${index.toString}`}>
								{action}
							</HStack>
						))}
					</VStack>
				)}
				<VStack w="100%" justify="center">
					<Text variant="h5">{title}</Text>
				</VStack>
				<HStack w="100%" align="baseline" justify="space-between">
					<Text variant="h5">{author}</Text>
					<Text variant="h6">{date}</Text>
				</HStack>
				<VStack w="100%" align="left" spacing="8px">
					<Text variant="h6">{topic}</Text>
					<Text variant="p" noOfLines={3}>
						{content}
					</Text>
				</VStack>
			</VStack>
			<Flex direction="row-reverse" w="100%">
				<Button variant="secondary-4" maxW="160px" onClick={() => navigate(`/articles/${id}`)}>
					Lire la suite
				</Button>
			</Flex>
		</VStack>
	);
};

export default ArticleCard;
