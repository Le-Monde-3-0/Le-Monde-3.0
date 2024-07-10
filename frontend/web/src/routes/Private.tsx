import * as React from 'react';
import { Outlet } from 'react-router-dom';

import PrivateLayout from 'layouts/Private';

const Private = (): JSX.Element => {
	return (
		<PrivateLayout>
			<Outlet />
		</PrivateLayout>
	);
};

export default Private;
