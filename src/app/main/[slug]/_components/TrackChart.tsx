'use client';

import { Track } from '@/lib/type';
import { LineChart } from '@tremor/react';

export default function TrackChart({ track }: { track: Track | undefined }) {
    const geoJson = JSON.parse(track?.path!);
    const { coordinates } = geoJson.features[0].geometry;
    const coord = coordinates.map((c: any, i: number) => ({
        elevation: c[2],
        index: i,
    }));

    const dataFormatter = (number: number) =>
        `${Intl.NumberFormat('us').format(number).toString()} ft`;

    return (
        <div className='min-h-[25vh] w-full'>
            <LineChart
                data={coord}
                index='index'
                categories={['elevation']}
                valueFormatter={dataFormatter}
                showXAxis={false}
                className='h-full'
            />
        </div>
    );
}
