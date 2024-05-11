import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Bar, ComposedChart, Label, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const Chart = ({
	yLabel,
	data,
}: {
	yLabel: string;
	data: { date: string; daily: number; summed: number }[];
}) => {
	return (
		<Box p="8px" background="gray.900" mt="4" rounded="md" shadow="md" width="100%">
			<ResponsiveContainer width="100%" height={400}>
				<ComposedChart width={800} height={400} data={data}>
					<Bar dataKey="daily" stroke="#8884d8" barSize={20} fill="#413ea0" />
					<Line type="monotone" dataKey="summed" stroke="#8884d8" />
					<XAxis dataKey="date">
						<Label value="Date" offset={-5} position="insideBottom" />
					</XAxis>
					<YAxis>
						<Label value={yLabel} angle={-90} position="insideLeft" />
					</YAxis>
					<Tooltip />
				</ComposedChart>
			</ResponsiveContainer>
		</Box>
	);
};
