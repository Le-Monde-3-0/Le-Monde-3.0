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
		<Input id={inputId} border={isError ? '1px solid red' : undefined} {...props} />
		{isError && (
			<Text variant="h6" color="red">
				{errorMessage}
			</Text>
		)}
	</VStack>
);

export default FormInput;
