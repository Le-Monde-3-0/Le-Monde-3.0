import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Icon,
	StackProps,
	Text,
	VStack,
	useBreakpointValue,
	useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, HamburgerIcon } from '@chakra-ui/icons';
import { FaBookOpen, FaPenNib } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';

import { useUserContext } from 'contexts/user';

type PrivateProps = { children: JSX.Element };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Title = ({ icon, name, isEnable = true }: { icon: any; name: string; isEnable?: boolean }): JSX.Element => (
	<HStack position="relative" w="100%" opacity={isEnable ? '1' : '0.5'}>
		<Icon as={icon} position="absolute" left="40px" boxSize={12} color="white" />
		<Text variant="h4" fontWeight="bold" pl="120px">
			{name}
		</Text>
	</HStack>
);

const Option = ({
	name,
	isSelected,
	onClick,
	isEnable = true,
}: {
	name: string;
	isSelected: boolean;
	onClick: () => void;
	isEnable?: boolean;
}): JSX.Element => (
	<Box
		position="relative"
		w="100%"
		cursor={isEnable ? 'pointer' : 'not-allowed'}
		onClick={() => {
			if (isEnable) onClick();
		}}
	>
		<Box
			position="absolute"
			left={0}
			display={isSelected ? 'block' : 'none'}
			w="8px"
			h="24px"
			bg="primary.yellow"
			borderRadius="sm"
		/>
		<Text
			variant="link"
			fontWeight="medium"
			pl="120px"
			color={isSelected ? 'primary.yellow !important' : 'white !important'}
			opacity={isEnable ? '1' : '0.5'}
		>
			{name}
		</Text>
	</Box>
);

const NavBar = ({ ...props }: StackProps): JSX.Element => {
	const { user } = useUserContext();
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<VStack
			w="100%"
			h="100%"
			spacing="32px"
			p="16px 16px 32px 0px"
			borderTopRightRadius="sm"
			borderBottomRightRadius="sm"
			bg="gray.900"
			overflowY="scroll"
			{...props}
			css={{
				'&::-webkit-scrollbar': {
					width: '0px',
				},
			}}
		>
			<VStack w="100%" spacing="16px" mt="48px">
				// TODO: username
				<Text variant="h4">Username</Text>
			</VStack>
			<VStack align="start" w="100%">
				<Title icon={FaBookOpen} name="Lire" />
				<Option name="Favoris" isSelected={location.pathname === '/favoris'} onClick={() => navigate('/favoris')} />
				<Option name="Dossiers" isSelected={location.pathname === '/dossiers'} onClick={() => navigate('/dossiers')} />
				<Option
					name="Nouveautés"
					isSelected={location.pathname === '/nouveautes'}
					onClick={() => navigate('/nouveautes')}
				/>
				<Option
					name="Découvertes"
					isSelected={location.pathname === '/decouvertes'}
					onClick={() => navigate('/decouvertes')}
				/>
			</VStack>
			<VStack align="start" w="100%">
				<Title icon={FaPenNib} name="Écrire" isEnable={!user.isOffline} />
				<Option
					name="Nouvel article"
					isSelected={location.pathname === '/nouvel-article'}
					onClick={() => navigate('/nouvel-article')}
					isEnable={!user.isOffline}
				/>
				<Option
					name="Publications"
					isSelected={location.pathname === '/publications'}
					onClick={() => navigate('/publications')}
					isEnable={!user.isOffline}
				/>
				<Option
					name="Brouillons"
					isSelected={location.pathname === '/brouillons'}
					onClick={() => navigate('/brouillons')}
					isEnable={!user.isOffline}
				/>
			</VStack>
			<VStack align="start" w="100%">
				<Title icon={MdAccountCircle} name="Compte" />
				<Option
					name="Réglages"
					isSelected={location.pathname === '/reglages'}
					onClick={() => navigate('/reglages')}
					isEnable={!user.isOffline}
				/>
			</VStack>
		</VStack>
	);
};

const Private = ({ children }: PrivateProps): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const collapseNavBar = useBreakpointValue({ base: true, xl: false });

	return (
		<HStack position="relative" align="start" h="100vh !important" spacing="0px">
			{collapseNavBar ? (
				<>
					<Button
						position="absolute"
						top={{ base: '8px', md: '16px', lg: '24px' }}
						left={{ base: '8px', md: '16px', lg: '24px' }}
						zIndex={100}
						onClick={onOpen}
						bg="gray.900"
					>
						<Icon fontSize="24px" as={HamburgerIcon} color="white" />
						// TODO: username
						<Text ml="4px" variant="link">
							Username
						</Text>
					</Button>
					<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
						<DrawerOverlay />
						<DrawerContent bg="black" w="360px !important">
							<NavBar />
						</DrawerContent>
					</Drawer>
				</>
			) : (
				<NavBar w="480px !important" h="100% !important" />
			)}
			<Box
				w="100%"
				h="100% !important"
				overflowY="scroll"
				css={{
					'&::-webkit-scrollbar': {
						width: '0px',
					},
				}}
				p={{
					base: '56px 8px 8px 8px',
					md: '64px 16px 16px 16px',
					lg: '72px 24px 24px 24px',
					xl: '24px 24px 24px 24px',
				}}
			>
				{children}
			</Box>
		</HStack>
	);
};

export default Private;
