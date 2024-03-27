import { CircularProgress, Grid, Text, GridItem, VStack } from '@chakra-ui/react';
import CategoryCard from 'components/Cards/CategoryCard';
import SearchInput from 'components/Inputs/SearchInput';
import { useAuthContext } from 'contexts/auth';
import * as React from 'react';
import { useEffect, useState } from 'react';

const Publications = (): JSX.Element => {
	const [search, setSearch] = useState('');
	const { auth } = useAuthContext();
	const [categories, setCategories] = useState<{ name: string; image: string }[]>();

	const uiGetCategories = async () => {
		try {
			// const res = await getCategories();
			// requestResponseToast(res);
			setCategories([
				{
					name: 'News',
					image: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg',
				},
				{
					name: 'Science',
					image: 'https://images.pexels.com/photos/414860/pexels-photo-414860.jpeg',
				},
				{
					name: 'Technology',
					image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
				},
				{
					name: 'Health',
					image: 'https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg',
				},
				{
					name: 'Sports',
					image: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg',
				},
				{
					name: 'Entertainment',
					image:
						'https://images.pexels.com/photos/16580468/pexels-photo-16580468/free-photo-of-close-up-of-a-dj-mixing-music-on-a-dj-controller.jpeg',
				},
				{
					name: 'Business',
					image: 'https://images.pexels.com/photos/351264/pexels-photo-351264.jpeg',
				},
				{
					name: 'Politics',
					image: 'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg',
				},
				{
					name: 'Travel',
					image: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
				},
			]);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		uiGetCategories();
	}, [auth]);

	if (!categories) {
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
				<SearchInput
					value={search}
					inputId="publications-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis les différentes catégories"
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
				</Grid>
			</VStack>
		</>
	);
};

export default Publications;
