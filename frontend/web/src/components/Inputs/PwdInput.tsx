import * as React from 'react';
import { useState } from 'react';
import { Button, Input, InputGroup, InputProps, InputRightElement, Text, VStack } from '@chakra-ui/react';

const PwdInput = ({
	inputId,
	isError,
	errorMessage,
	...props
}: {
	inputId: string;
	isError?: boolean;
	errorMessage?: string;
} & InputProps): JSX.Element => {
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	return (
		<InputGroup size="md">
			<VStack w="100%" spacing="0px" align="left">
				<Input id={inputId} {...props} type={show ? 'text' : 'password'} />
				{isError && (
					<Text variant="p" color="red !important">
						{errorMessage}
					</Text>
				)}
			</VStack>
			<InputRightElement w="5rem">
				<Button
					h="1.75rem"
					size="sm"
					_focus={{ outline: 'solid 3px', outlineColor: 'yellow', outlineOffset: '0px' }}
					onClick={handleClick}
				>
					{show ? 'Cacher' : 'Voir'}
				</Button>
			</InputRightElement>
		</InputGroup>
	);
};

export default PwdInput;
