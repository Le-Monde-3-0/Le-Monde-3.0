import * as React from 'react';
import { Text, VStack } from '@chakra-ui/react';

import SearchInput from 'components/Inputs/SearchInput';

const Publications = (): JSX.Element => {
	// const [search, setSearch] = useState('');

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				// TODO: page avec les topics
				<Text>TODO</Text>
				{/* <SearchInput
					value={search}
					inputId="publications-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Rechercher un article"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<Text variant="h4">Catégories</Text>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
					h="100%"
				>
					{categories.map((category, index) => (
						<GridItem key={`${index.toString()}`} borderRadius={'sm'}>
							<CategoryCard category={category} />
						</GridItem>
					))}
				</Grid> */}
			</VStack>
		</>
	);
};

export default Publications;
