import { Image, Text, VStack, Box } from '@chakra-ui/react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import borderRadius from 'theme/foundations/borderRadius';

const CategoryCard = ({ category }: { category: { name: string; image: string } }): JSX.Element => {
	const navigate = useNavigate();

	return (
		<Box cursor="pointer" h={250} position={'relative'} borderRadius={'sm'} overflow={'hidden'}>
			<Box
				backgroundImage={`url(${category.image})`}
				backgroundPosition="center"
				backgroundSize="cover"
				display="flex"
				justifyContent="center"
				alignItems="center"
				textAlign={'center'}
				width="100%"
				height="100%"
				position="relative" // Make sure to set position relative here
			>
				<Box
					position="absolute" // Position the overlay absolutely
					top={0}
					left={0}
					width={'100%'}
					height={'100%'}
					backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5))"
					zIndex={1}
				/>
				<Text fontSize="6xl" color={'white'} zIndex={2}>
					{' '}
					{/* Set zIndex for the text to make sure it appears above the overlay */}
					{category.name}
				</Text>
			</Box>
		</Box>
	);
};

export default CategoryCard;
