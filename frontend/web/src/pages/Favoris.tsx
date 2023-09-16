import * as React from 'react';
import { useState } from 'react';
import { Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';

const Favoris = (): JSX.Element => {
	const [search, setSearch] = useState('');

	return (
		<>
			<VStack w="100%" spacing="48px" py="48px">
				<SearchInput
					value={search}
					inputId="favoris-search-input"
					maxW="640px"
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Grid templateColumns="repeat(3, 1fr)" gap={6} w="100%">
					<GridItem>
						<ArticleCard
							id="1000"
							title="Titre 1"
							author="User-1"
							date="08/12/2023"
							topic="Topic"
							content="small content"
							actions={[
								<>
									<AddIcon />
									<Text variant="h6">Ajouter à un marque page</Text>
								</>,
								<>
									<CloseIcon />
									<Text variant="h6">Retirer des favoris</Text>
								</>,
							]}
						/>
					</GridItem>
					<GridItem>
						<ArticleCard
							id="1000"
							title="Titre 2"
							author="User-2"
							date="08/12/2023"
							topic="Topic"
							content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit laoreet id donec ultrices tincidunt arcu non sodales. Massa tempor nec feugiat nisl pretium fusce id. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Vel risus commodo viverra maecenas accumsan lacus. Sed id semper risus in hendrerit gravida rutrum quisque non. Vitae et leo duis ut diam quam. Purus non enim praesent elementum. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Consectetur adipiscing elit pellentesque habitant morbi tristique. Enim diam vulputate ut pharetra. Consectetur a erat nam at lectus urna duis. Ipsum consequat nisl vel pretium lectus quam id. Sed blandit libero volutpat sed cras ornare arcu dui. Quisque egestas diam in arcu cursus euismod quis. Duis at consectetur lorem donec massa sapien faucibus. Est velit egestas dui id ornare arcu.

Dictum fusce ut placerat orci nulla pellentesque dignissim enim sit. Egestas integer eget aliquet nibh. Consequat semper viverra nam libero justo laoreet sit. Et magnis dis parturient montes nascetur. Hac habitasse platea dictumst quisque sagittis purus sit amet volutpat. Sem nulla pharetra diam sit. Lacus sed viverra tellus in hac habitasse. Luctus accumsan tortor posuere ac ut consequat. Amet consectetur adipiscing elit duis tristique. Lorem sed risus ultricies tristique nulla aliquet.
`}
							actions={[
								<>
									<AddIcon />
									<Text variant="h6">Ajouter à un marque page</Text>
								</>,
								<>
									<CloseIcon />
									<Text variant="h6">Retirer des favoris</Text>
								</>,
							]}
						/>
					</GridItem>
					<GridItem>
						<ArticleCard
							id="1000"
							title="Titre 3"
							author="User-3"
							date="08/12/2023"
							topic="Topic"
							content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit laoreet id donec ultrices tincidunt arcu non sodales. Massa tempor nec feugiat nisl pretium fusce id. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Vel risus commodo viverra maecenas accumsan lacus. Sed id semper risus in hendrerit gravida rutrum quisque non. Vitae et leo duis ut diam quam. Purus non enim praesent elementum. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Consectetur adipiscing elit pellentesque habitant morbi tristique. Enim diam vulputate ut pharetra. Consectetur a erat nam at lectus urna duis. Ipsum consequat nisl vel pretium lectus quam id. Sed blandit libero volutpat sed cras ornare arcu dui. Quisque egestas diam in arcu cursus euismod quis. Duis at consectetur lorem donec massa sapien faucibus. Est velit egestas dui id ornare arcu.

Dictum fusce ut placerat orci nulla pellentesque dignissim enim sit. Egestas integer eget aliquet nibh. Consequat semper viverra nam libero justo laoreet sit. Et magnis dis parturient montes nascetur. Hac habitasse platea dictumst quisque sagittis purus sit amet volutpat. Sem nulla pharetra diam sit. Lacus sed viverra tellus in hac habitasse. Luctus accumsan tortor posuere ac ut consequat. Amet consectetur adipiscing elit duis tristique. Lorem sed risus ultricies tristique nulla aliquet.
`}
							actions={[
								<>
									<AddIcon />
									<Text variant="h6">Ajouter à un marque page</Text>
								</>,
								<>
									<CloseIcon />
									<Text variant="h6">Retirer des favoris</Text>
								</>,
							]}
						/>
					</GridItem>
					<GridItem>
						<ArticleCard
							id="1000"
							title="Titre 4"
							author="User-4"
							date="08/12/2023"
							topic="Topic"
							content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit laoreet id donec ultrices tincidunt arcu non sodales. Massa tempor nec feugiat nisl pretium fusce id. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Vel risus commodo viverra maecenas accumsan lacus. Sed id semper risus in hendrerit gravida rutrum quisque non. Vitae et leo duis ut diam quam. Purus non enim praesent elementum. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Consectetur adipiscing elit pellentesque habitant morbi tristique. Enim diam vulputate ut pharetra. Consectetur a erat nam at lectus urna duis. Ipsum consequat nisl vel pretium lectus quam id. Sed blandit libero volutpat sed cras ornare arcu dui. Quisque egestas diam in arcu cursus euismod quis. Duis at consectetur lorem donec massa sapien faucibus. Est velit egestas dui id ornare arcu.

Dictum fusce ut placerat orci nulla pellentesque dignissim enim sit. Egestas integer eget aliquet nibh. Consequat semper viverra nam libero justo laoreet sit. Et magnis dis parturient montes nascetur. Hac habitasse platea dictumst quisque sagittis purus sit amet volutpat. Sem nulla pharetra diam sit. Lacus sed viverra tellus in hac habitasse. Luctus accumsan tortor posuere ac ut consequat. Amet consectetur adipiscing elit duis tristique. Lorem sed risus ultricies tristique nulla aliquet.
`}
							actions={[
								<>
									<AddIcon />
									<Text variant="h6">Ajouter à un marque page</Text>
								</>,
								<>
									<CloseIcon />
									<Text variant="h6">Retirer des favoris</Text>
								</>,
							]}
						/>
					</GridItem>
				</Grid>
			</VStack>
		</>
	);
};

export default Favoris;
