import * as React from 'react';
import { Input, InputProps, Text, VStack } from '@chakra-ui/react';

const FormInput = ({
	inputId,
	isError,
	errorMessage,
	...props
}: {
	inputId: string;
	isError: boolean;
	errorMessage: string;
} & InputProps): JSX.Element => (
	<VStack w="100%" spacing="0px" align="left">
		<Input id={inputId} {...props} />
		{isError && (
			<Text variant="p" color="red !important">
				{errorMessage}
			</Text>
		)}
	</VStack>
);

export default FormInput;
