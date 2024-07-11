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
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaPenFancy } from 'react-icons/fa6';
import { IoLibrary } from 'react-icons/io5';
import { MdAdminPanelSettings, MdTravelExplore } from 'react-icons/md';

import { useUserContext } from 'contexts/user';
import { useAuthContext } from 'contexts/auth';

type PrivateProps = { children: JSX.Element };

const Option = ({
	icon,
	name,
	isSelected,
	onClick,
	isEnable = true,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
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
		<HStack position="relative" w="100%" opacity={isEnable ? '1' : '0.5'}>
			<Icon
				as={icon}
				position="absolute"
				left="40px"
				boxSize={10}
				color={isSelected ? 'primary.yellow !important' : 'gray.200 !important'}
			/>
			<Text
				variant="link"
				fontWeight={isSelected ? 'bold' : 'medium'}
				pl="120px"
				color={isSelected ? 'primary.yellow !important' : 'gray.200 !important'}
				opacity={isEnable ? '1' : '0.5'}
			>
				{name}
			</Text>
		</HStack>
	</Box>
);

const NavBar = ({ ...props }: StackProps): JSX.Element => {
	const auth = useAuthContext();
	const user = useUserContext();
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<VStack
			w="100%"
			h="100%"
			spacing="56px"
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
				<Text variant="h4" fontWeight="bold">{auth.data.username}</Text>
			</VStack>
			<VStack w="100%" spacing="40px">
				<VStack align="start" w="100%">
					<Option
						icon={IoLibrary}
						name="Bibliothèque"
						isSelected={location.pathname === '/bibliotheque'}
						onClick={() => navigate('/bibliotheque')}
						// TODO: IPFS managment
						// isEnable={!user.data.user.isOffline}
					/>
				</VStack>
				<VStack align="start" w="100%">
					<Option
						icon={MdTravelExplore}
						name="Explorer"
						isSelected={location.pathname === '/explorer'}
						onClick={() => navigate('/explorer')}
						// TODO: IPFS managment
						// isEnable={!user.data.user.isOffline}
					/>
				</VStack>
				<VStack align="start" w="100%">
					<Option
						icon={FaPenFancy}
						name="Rédactions"
						isSelected={location.pathname === '/redactions'}
						onClick={() => navigate('/redactions')}
						// TODO: IPFS managment
						// isEnable={!user.data.user.isOffline}
					/>
				</VStack>
				<VStack align="start" w="100%">
					<Option
						icon={MdAdminPanelSettings}
						name="Réglages"
						isSelected={location.pathname === '/reglages'}
						onClick={() => navigate('/reglages')}
						// TODO: IPFS managment
						// isEnable={!user.data.user.isOffline}
					/>
				</VStack>
			</VStack>
		</VStack>
	);
};

const Private = ({ children }: PrivateProps): JSX.Element => {
	const auth = useAuthContext();
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
						<Text ml="4px" variant="link">
							{auth.data.username}
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
