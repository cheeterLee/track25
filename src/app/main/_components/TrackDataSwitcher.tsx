'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrackStore } from '@/providers/TrackStoreProvider';

export default function TrackDataSwitcher() {
    const { selectAllTracks, selectMyTracks } = useTrackStore((state) => state);

    return (
        <TabsList className='gap-1'>
            <TabsTrigger onClick={selectMyTracks} value='my'>
                My tracks
            </TabsTrigger>
            <TabsTrigger onClick={selectAllTracks} value='all'>
                All tracks
            </TabsTrigger>
        </TabsList>
    );
}
