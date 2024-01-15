import * as React from 'react';
import { useState } from 'react';
import { Box, HStack, StackProps, VStack } from '@chakra-ui/react';

const ArticleTrigger = ({ actions, ...props }: { actions: JSX.Element[] } & StackProps): JSX.Element => {
	const [triggered, setTriggered] = useState(false);

	return (
		<VStack w="100%" spacing="4px" align="flex-end" {...props}>
			<HStack
				cursor="pointer"
				borderRadius="sm"
				p="8px"
				bg="gray.300"
				backdropBlur="5px"
				onClick={() => setTriggered(!triggered)}
				spacing="4px"
			>
				<Box borderRadius="50%" w="8px" h="8px" backgroundColor="gray.900" />
				<Box borderRadius="50%" w="8px" h="8px" backgroundColor="gray.900" />
				<Box borderRadius="50%" w="8px" h="8px" backgroundColor="gray.900" />
			</HStack>
			{triggered && (
				<VStack p="8px" backgroundColor="secondary.4" borderRadius="sm" align="left">
					{actions.map((action, index) => (
						<HStack cursor="pointer" key={`${index.toString()}`}>
							{action}
						</HStack>
					))}
				</VStack>
			)}
		</VStack>
	);
};

export default ArticleTrigger;
