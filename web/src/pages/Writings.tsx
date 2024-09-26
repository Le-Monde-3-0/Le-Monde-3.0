import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from '@chakra-ui/icons';
import { Button, HStack, Icon, Select, Stack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { CiSquarePlus } from 'react-icons/ci';
import { FaFilter, FaSort } from 'react-icons/fa';
import { FaSortDown, FaSortUp } from 'react-icons/fa6';
import { PiArticleNyTimesBold } from 'react-icons/pi';
import { RiDraftFill, RiFilterOffLine } from 'react-icons/ri';

import { Topic } from 'types/topic';
import { Article } from 'types/article';
import ArticleCard from 'components/Cards/ArticleCard';
import SearchInput from 'components/Inputs/SearchInput';
import { useUIContext } from 'contexts/ui';

const Writings = (): JSX.Element => {
	const ui = useUIContext();
	const navigate = useNavigate();
	const [refresh, setRefresh] = useState(1);
	const [filter, setFilter] = useState(false);
	const [search, setSearch] = useState('');
	const [topic, setTopic] = useState<Topic | undefined>(undefined);
	const [sortLikes, setSortLikes] = useState<'UP' | 'DOWN' | 'NONE'>('NONE');
	const [sortViews, setSortViews] = useState<'UP' | 'DOWN' | 'NONE'>('NONE');
	const [showDrafts, setShowDrafts] = useState(true);
	const [showPublications, setShowPublications] = useState(true);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [articles, setArticles] = useState<Article[]>([]);

	useEffect(() => {
		ui.online.articles.search.myArticles({ query: search, topic: topic?.id }, (returnedArticles: Article[]) =>
			setArticles(returnedArticles.filter((a) => a.draft === showDrafts || !a.draft === showPublications)),
		);
	}, [refresh]);

	useEffect(() => {
		const topicsIds = articles.map((a) => a.topicId).filter((value, index, array) => array.indexOf(value) === index);
		ui.online.topics.search.all((allTopics: Topic[]) =>
			setTopics(topicsIds.map((id) => allTopics.find((t) => t.id === id)!)),
		);
	}, [articles]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!filter) {
				ui.online.articles.search.myArticles({}, setArticles);
			} else {
				ui.online.articles.search.myArticles({ query: search, topic: topic?.id }, (returnedArticles: Article[]) =>
					setArticles(returnedArticles.filter((a) => a.draft === showDrafts || !a.draft === showPublications)),
				);
			}
		}, 0.7 * 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [filter, search, topic, showDrafts, showPublications]);

	useEffect(() => {
		setArticles(
			articles.sort((a, b) => {
				if (sortLikes === 'UP') return b.likeCounter - a.likeCounter;
				if (sortLikes === 'DOWN') return a.likeCounter - b.likeCounter;
				if (sortViews === 'UP') return b.viewCounter - a.viewCounter;
				if (sortViews === 'DOWN') return a.viewCounter - b.viewCounter;
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}),
		);
	}, [sortLikes, sortViews, articles]);

	return (
		<VStack w="100%" spacing={{ base: '8px', md: '16px', lg: '24px', xl: '32px' }} align="start">
			<HStack w="100%" align="center" spacing="24px">
				<Text variant="h5">Rédactions</Text>
				<Icon
					as={CiSquarePlus}
					boxSize={12}
					color="primary.yellow"
					cursor="pointer"
					onClick={() => navigate('/ecrire')}
				/>
			</HStack>
			<VStack w="100%" align="start">
				<HStack flexWrap="wrap">
					<Button variant="secondary-yellow" onClick={() => setFilter(!filter)}>
						<Icon as={filter ? FaFilter : RiFilterOffLine} boxSize={4} mr="8px" />
						<Text variant="p" color="primary.yellow !important">
							Filtrer
						</Text>
					</Button>
					<Button
						bg="gray.900"
						_hover={{
							opacity: '80%',
							transition: 'ease 0.5s',
						}}
						px="24px"
						onClick={() => {
							setSortViews('NONE');
							if (sortLikes === 'NONE') setSortLikes('UP');
							else if (sortLikes === 'UP') setSortLikes('DOWN');
							else setSortLikes('NONE');
						}}
					>
						<Icon
							as={sortLikes === 'NONE' ? FaSort : sortLikes === 'UP' ? FaSortUp : FaSortDown}
							boxSize={4}
							color="white"
							mr="8px"
						/>
						<Text variant="p">j'aimes</Text>
					</Button>
					<Button
						bg="gray.900"
						px="24px"
						_hover={{
							opacity: '80%',
							transition: 'ease 0.5s',
						}}
						onClick={() => {
							setSortLikes('NONE');
							if (sortViews === 'NONE') setSortViews('UP');
							else if (sortViews === 'UP') setSortViews('DOWN');
							else setSortViews('NONE');
						}}
					>
						<Icon
							as={sortViews === 'NONE' ? FaSort : sortViews === 'UP' ? FaSortUp : FaSortDown}
							boxSize={4}
							color="white"
							mr="8px"
						/>
						<Text variant="p">vues</Text>
					</Button>
					<Button
						bg="gray.900"
						_hover={{
							opacity: '80%',
							transition: 'ease 0.5s',
						}}
						_active={{
							bg: 'gray.900',
						}}
						px="24px"
						onClick={() => setShowPublications(!showPublications)}
					>
						<Icon as={PiArticleNyTimesBold} boxSize={showPublications ? 6 : 5} color="white" mr="8px" />
						<Text variant="p" fontWeight={showPublications ? 'extra-bold' : 'light'}>
							Publications
						</Text>
					</Button>
					<Button
						bg="gray.900"
						_hover={{
							opacity: '80%',
							transition: 'ease 0.5s',
						}}
						_active={{
							bg: 'gray.900',
						}}
						px="24px"
						onClick={() => setShowDrafts(!showDrafts)}
					>
						<Icon as={RiDraftFill} boxSize={showDrafts ? 5 : 4} color="white" mr="8px" />
						<Text variant="p" fontWeight={showDrafts ? 'extra-bold' : 'light'}>
							Brouillons
						</Text>
					</Button>
				</HStack>
				{filter && (
					<Stack direction={{ xs: 'column', sm: 'row' }} w="100%" justify="flex-start">
						<SearchInput
							variant="primary-1"
							w={{ xs: '100%', sm: '320px' }}
							placeholder="..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Select
							variant="primary-1"
							w={{ xs: '100%', sm: '222px' }}
							minW={{ xs: 'auto', md: '200px' }}
							sx={{
								'> option': {
									background: '#212529',
								},
							}}
							onChange={(e) => setTopic(topics.find((t) => t.name === e.target.value)!)}
						>
							{topics.map((t, index) => (
								<option key={index}>{t.name}</option>
							))}
						</Select>
					</Stack>
				)}
			</VStack>
			<HStack w="100%" spacing="16px" flexWrap="wrap">
				{articles.map((article, index) => (
					<ArticleCard
						navigateUrl={`/articles/${article.id}`}
						key={index.toString()}
						title={article.title}
						// TODO: author name
						author={`Author #${article.authorId}`}
						date={new Date().toLocaleDateString('fr-FR')}
						// TODO: topic name
						topic={`Topic #${article.topicId}`}
						content={article.content}
						actions={[
							// TODO: draft to publication
							<Tooltip label="Supprimer définitivement">
								<span>
									<DeleteIcon
										onClick={async () => await ui.online.articles.delete(article.id, () => setRefresh((r) => r + 1))}
										color="black"
									/>
								</span>
							</Tooltip>,
						]}
						likes={article.likeCounter}
						views={article.viewCounter}
						view="publisher"
					/>
				))}
			</HStack>
		</VStack>
	);
};

export default Writings;
