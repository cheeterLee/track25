'use client';

import mapboxgl from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useRef, useEffect, useState } from 'react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_KEY ?? '';

export default function MapWrapper() {
    const mapContainer = useRef(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(7.161);
    const [lat, setLat] = useState(47.319);
    const [zoom, setZoom] = useState(9);

    const { theme } = useTheme();

    useEffect(() => {
        if (map.current) {
            return;
        }

        map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style:
                theme === 'dark'
                    ? 'mapbox://styles/mapbox/dark-v11'
                    : 'mapbox://styles/mapbox/outdoors-v11',
            center: [lng, lat],
            zoom: zoom,
        });
    }, [lng, lat, zoom, theme]);

    useEffect(() => {
        map.current?.setStyle(
            theme === 'dark'
                ? 'mapbox://styles/mapbox/dark-v11'
                : 'mapbox://styles/mapbox/outdoors-v11',
        );
    }, [theme]);

    return (
        <div className='hidden h-screen flex-1 sm:block'>
            <div className='h-full w-full' ref={mapContainer} />
        </div>
    );
}
