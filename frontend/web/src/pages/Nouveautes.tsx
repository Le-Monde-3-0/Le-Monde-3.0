import * as React from 'react';
import { Text, VStack } from '@chakra-ui/react';

const Nouveates = (): JSX.Element => {
	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<Text>TODO nouveautés</Text>
			</VStack>
		</>
	);
};

export default Nouveates;
