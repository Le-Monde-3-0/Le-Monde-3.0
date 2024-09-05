import * as React from 'react';
import { useEffect, useState } from 'react';
import { DeleteIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Button, HStack, Icon, Select, Stack, Text, Tooltip, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
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
import { useOnlineUserContext } from 'contexts/onlineUser';

const Writings = (): JSX.Element => {
	const navigate = useNavigate();
	const { handleToast } = useUIContext();
	const { methods } = useOnlineUserContext();
	const [filter, setFilter] = useState(false);
	const [search, setSearch] = useState('');
	const [topic, setTopic] = useState('');
	const [sortLikes, setSortLikes] = useState<'UP' | 'DOWN' | 'NONE'>('NONE');
	const [sortViews, setSortViews] = useState<'UP' | 'DOWN' | 'NONE'>('NONE');
	const [showDrafts, setShowDrafts] = useState(true);
	const [showPublications, setShowPublications] = useState(true);
	const [writtenArticles, setWrittenArticles] = useState<Article[]>([]);
	const [articles, setArticles] = useState<Article[]>([]);
	const [topics, setTopics] = useState<Topic[]>([]);

	// TODO: put in UI context ?
	const uiLoadData = async () => {
		try {
			const res = await methods.articles.load.written();
			handleToast(res);
			if (res.status === 'success') {
				setArticles(res.data!);
				setWrittenArticles(res.data!);
				setTopics(
					res
						.data!.map((a) => a.topic!.name)
						.filter((value, index, array) => array.indexOf(value) === index)
						.map((n) => res.data!.find((a) => a.topic!.name === n)!.topic!),
				);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const uiFilterArticles = async () => {
		console.log(filter);
		console.log(topics.find((t) => t.name === topic));
		console.log(search);
		try {
			const res = await methods.articles.search.many({
				author: 'me',
				draft: showDrafts,
				topic: topics.find((t) => t.name === topic)?.id,
				query: search === '' ? undefined : search,
			});
			handleToast(res);
			setArticles(res.data!);
		} catch (error) {
			console.error(error);
		}
	};

	const uiDeleteArticle = async (id: number) => {
		try {
			const res = await methods.articles.delete({ id });
			handleToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	const uiUpdateArticle = async (id: number) => {
		try {
			const res = await methods.articles.update({ id, newDraft: true });
			handleToast(res, true);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!filter) setArticles(writtenArticles);
		const timer = setTimeout(() => {
			if (filter && (topic || search !== '')) {
				uiFilterArticles();
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

	useEffect(() => {
		uiLoadData();
	}, []);

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
							onChange={(e) => setTopic(e.target.value)}
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
						// TODO: topic
						topic={`Topic #${article.topicId}`}
						content={article.content}
						actions={[
							<Tooltip label="Archiver dans les brouillons">
								<span>
									<ViewOffIcon onClick={() => uiUpdateArticle(article.id)} color="black" />
								</span>
							</Tooltip>,
							<Tooltip label="Supprimer définitivement">
								<span>
									<DeleteIcon onClick={() => uiDeleteArticle(article.id)} color="black" />
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
