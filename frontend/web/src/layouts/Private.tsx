import * as React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Icon,
	Image,
	Slide,
	StackProps,
	Text,
	VStack,
	useBreakpointValue,
	useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { FaPenFancy } from 'react-icons/fa6';
import { IoLibrary } from 'react-icons/io5';
import { MdAdminPanelSettings, MdTravelExplore } from 'react-icons/md';

// import BlackLogo from 'theme/logos/black.svg';
import WhiteLogo from 'theme/logos/white.svg';
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
			<VStack w="100%" spacing="24px" mt="48px">
				<Image src={WhiteLogo} w="100%" maxW="80px" maxH="80px" />
				<Text variant="h5" fontWeight="bold">
					{auth.data.username || 'Handling'}
				</Text>
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
	const drawer = useDisclosure();
	const slide = useDisclosure();
	const [showCross, setShowCross] = useState(false);
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
						onClick={drawer.onOpen}
						bg="gray.900 !important"
					>
						<Icon fontSize="24px" as={HamburgerIcon} color="white" />
						<Text ml="4px" variant="link">
							{auth.data.username}
						</Text>
					</Button>
					<Drawer isOpen={drawer.isOpen} placement="left" onClose={drawer.onClose}>
						<DrawerOverlay />
						<DrawerContent bg="black" w="360px !important">
							<NavBar />
						</DrawerContent>
					</Drawer>
				</>
			) : (
				<>
					<Button
						hidden={!slide.isOpen ? !showCross : false}
						position="absolute"
						top={{ base: '0px', lg: !slide.isOpen ? '8px' : '24px' }}
						left={{ base: '0px', lg: !slide.isOpen ? '272px' : '24px' }}
						zIndex={100}
						onClick={slide.onToggle}
						bg={!slide.isOpen ? 'transparent !important' : 'gray.900 !important'}
						onMouseOver={() => setShowCross(true)}
					>
						<Icon
							fontSize={!slide.isOpen ? '12px' : '24px'}
							as={!slide.isOpen ? CloseIcon : HamburgerIcon}
							color="white"
						/>
					</Button>
					{/* WARNING: change index.css along with the width */}
					<Slide direction="left" in={!slide.isOpen} style={{ zIndex: 10 }} id="slide-navbar">
						<NavBar
							w="320px !important"
							h="100% !important"
							onMouseOver={() => setShowCross(true)}
							onMouseLeave={() => setShowCross(false)}
						/>
					</Slide>
				</>
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
					xl: '80px 160px 80px 160px',
				}}
				ml={{ base: '0px', xl: !slide.isOpen ? '320px' : '88px' }}
			>
				{children}
			</Box>
		</HStack>
	);
};

export default Private;
