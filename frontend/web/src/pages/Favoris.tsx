import * as React from 'react';
import { useState } from 'react';
import { Grid, GridItem, HStack, Text, Tooltip, VStack, useDisclosure } from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

import { Article } from 'types/article';
import { useUserContext } from 'contexts/user';
import { useUIContext } from 'contexts/ui';
import SearchInput from 'components/Inputs/SearchInput';
import ArticleCard from 'components/Cards/ArticleCard';
import AnthologiesModal from 'components/modals/Anthologies';

const Favoris = (): JSX.Element => {
	const { handleToast } = useUIContext();
	const { data, methods } = useUserContext();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [search, setSearch] = useState('');
	const [articleToAdd, setArticleToAdd] = useState<Article | undefined>(undefined);

	const uiUnlikeArticle = async (id: number) => {
		try {
			const res = await methods.articles.like({ id, isLiked: false });
			handleToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiCreateAnthology = async (title: string, description: string) => {
		try {
			const res = await methods.anthologies.create({
				name: title,
				description,
				isPublic: false,
				articles: [articleToAdd!.id],
			});
			handleToast(res, true);
			if (res.status === 'success') onClose();
		} catch (error) {
			console.error(error);
		}
	};

	const uiAddArticleToAnthology = async (id: number) => {
		try {
			const res = await methods.anthologies.update({ id, addArticles: [articleToAdd!.id] });
			handleToast(res, true, true, false, 'Article ajouté au dossier.');
			if (res.status === 'success') onClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<VStack w="100%" spacing={{ base: '8px', md: '12px', lg: '16px' }} align="start">
				<SearchInput
					value={search}
					inputId="favoris-search-input"
					w={{ base: '100%', xl: '640px' }}
					placeholder="Cherchez parmis vos articles favoris"
					onChange={(e) => setSearch(e.target.value)}
					variant="primary-1"
				/>
				<HStack>
					<Text variant="h5">Favori{data.user.articles.liked.length !== 1 && 's'}</Text>
					<Text
						variant="h5"
						bg="primary.yellow"
						color="gray.900 !important"
						fontWeight="black"
						p="0px 8px"
						borderRadius="md"
					>
						{data.user.articles.liked.length}
					</Text>
				</HStack>
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, minmax(0, 1fr));' }}
					gap={{ base: 2, lg: 4 }}
					w="100%"
				>
					{data.user.articles.liked
						.filter((a) => (search !== '' ? a.title.includes(search) : true))
						.map((article, index) => (
							<GridItem key={`${index.toString()}`}>
								<ArticleCard
									id={article.id}
									title={article.title}
									// TODO: author name
									author="Author"
									date={new Date(article.createdAt).toLocaleDateString('fr-FR')}
									// TODO: topic name
									topic="Topic"
									content={article.content}
									actions={[
										<Tooltip label="Ajouter à un dossier">
											<span>
												<AddIcon
													onClick={() => {
														setArticleToAdd(article);
														onOpen();
													}}
													color="black"
												/>
											</span>
										</Tooltip>,
										<Tooltip label="Supprimer des favoris">
											<span>
												<CloseIcon onClick={() => uiUnlikeArticle(article.id)} color="black" />
											</span>
										</Tooltip>,
									]}
									likes={article.totalLikes}
									views={article.totalViews}
								/>
							</GridItem>
						))}
				</Grid>
			</VStack>

			<AnthologiesModal
				isOpen={isOpen}
				onClose={onClose}
				anthologies={data.user.anthologies}
				createAnthology={uiCreateAnthology}
				action={uiAddArticleToAnthology}
			/>
		</>
	);
};

export default Favoris;
