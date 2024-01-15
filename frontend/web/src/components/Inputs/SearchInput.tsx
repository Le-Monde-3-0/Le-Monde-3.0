import * as React from 'react';
import { Input, InputGroup, InputProps, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchInput = ({
	value,
	inputId,
	...props
}: {
	value: string;
	inputId: string;
} & InputProps): JSX.Element => {
	return (
		<InputGroup size="md">
			<InputLeftElement pointerEvents="none">
				<SearchIcon color="white" />
			</InputLeftElement>
			<Input id={inputId} value={value} {...props} pl="40px" />
		</InputGroup>
	);
};

export default SearchInput;
