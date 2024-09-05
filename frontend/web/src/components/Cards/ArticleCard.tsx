import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FaEye } from 'react-icons/fa';
import { FcLike } from 'react-icons/fc';

const ArticleCard = ({
	navigateUrl,
	author,
	content,
	date,
	title,
	likes,
	views,
	topic,
	actions,
	view = 'reader',
}: {
	navigateUrl: string;
	author: string;
	content: string;
	date: string;
	likes?: number;
	views?: number;
	title: string;
	topic: string;
	actions: JSX.Element[];
	view?: 'publisher' | 'reader';
}): JSX.Element => {
	const navigate = useNavigate();

	return (
		<VStack
			w="100%"
			maxW="400px"
			h="100%"
			p={{ base: '8px', xl: '16px' }}
			bg="gray.900"
			borderRadius="sm"
			justify="space-between"
			spacing="16px"
		>
			<VStack w="100%" spacing={{ base: '8px', lg: '16px' }}>
				<HStack w="100%" alignItems="center" justifyContent="space-between">
					<Badge colorScheme="blue" borderRadius="xsm">
						{topic}
					</Badge>
					<HStack spacing="8px">
						{actions.map((action, index) => (
							<Box cursor="pointer" key={index.toString()}>
								{action}
							</Box>
						))}
					</HStack>
				</HStack>
				<VStack w="100%" align="start" spacing="0px" cursor="pointer" onClick={() => navigate(navigateUrl)}>
					<Text variant="h6">{title}</Text>
					{view === 'reader' && (
						<Text variant="p" color="gray.200 !important">
							@{author}
						</Text>
					)}
					<Text variant="info" color="gray.500 !important">
						{date}
					</Text>
				</VStack>
				<VStack id="testest" w="100%" align="left" spacing="8px" inlineSize="100%" maxInlineSize="calc(100vw - 32px);">
					<Text variant="p" noOfLines={3} maxW="100% !important">
						{content}
					</Text>
				</VStack>
			</VStack>
			<Flex direction="row" justify="space-between" w="100%">
				<HStack>
					{likes === undefined ? (
						<></>
					) : (
						<Badge colorScheme="green" borderRadius="xsm">
							<HStack>
								<Text color="green !important">{views}</Text> <Icon as={FcLike} boxSize={4} />
							</HStack>
						</Badge>
					)}
					{views === undefined ? (
						<></>
					) : (
						<Badge colorScheme="purple" borderRadius="xsm">
							<HStack>
								<Text color="green !important">{views}</Text> <Icon as={FaEye} boxSize={4} />
							</HStack>
						</Badge>
					)}
				</HStack>
				<Badge variant="outline" colorScheme="gray" borderRadius="xsm">
					1 min
				</Badge>
			</Flex>
		</VStack>
	);
};

export default ArticleCard;
