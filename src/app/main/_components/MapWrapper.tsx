'use client';

import { Track } from '@/lib/type';
import mapboxgl from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState, useCallback } from 'react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_KEY ?? '';

export default function MapWrapper({ myTrackData }: { myTrackData: Track[] }) {
    const mapContainer = useRef(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(7.161);
    const [lat, setLat] = useState(47.319);
    const [zoom, setZoom] = useState(6);
    const router = useRouter();

    const { theme } = useTheme();

    const addTrackLayers = useCallback(() => {
        myTrackData.forEach((track) => {
            const geoJson = JSON.parse(track.path);
            map.current?.addSource(track.slug, {
                type: 'geojson',
                data: geoJson,
            });
            map.current?.addLayer({
                id: track.slug,
                type: 'line',
                source: track.slug,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': 'red',
                    'line-width': 4,
                },
            });
            map.current?.addLayer({
                id: `${track.slug}-fill`,
                type: 'fill',
                source: track.slug,
                paint: {
                    'fill-color': 'transparent',
                    'fill-outline-color': 'transparent',
                },
            });
            map.current?.on('mouseenter', `${track.slug}-fill`, () => {
                map.current!.getCanvas().style.cursor = 'pointer';
                map.current!.setPaintProperty(track.slug, 'line-width', 8);
            });
            map.current?.on('mouseleave', `${track.slug}-fill`, () => {
                map.current!.getCanvas().style.cursor = '';
                map.current!.setPaintProperty(track.slug, 'line-width', 4);
            });
            map.current?.on('click', `${track.slug}-fill`, () => {
                const coords = geoJson.features[0].geometry.coordinates;
                const bounds = coords.reduce(
                    (b: any, coord: any) => {
                        return b.extend(coord);
                    },
                    new mapboxgl.LngLatBounds(coords[0], coords[0]),
                );
                map.current?.fitBounds(bounds, {
                    padding: 20,
                });
                router.push(`/main/${track.slug}`);
            });
        });
    }, [myTrackData, router]);

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

        map.current.on('load', () => {
            addTrackLayers();
        });

        map.current.on('style.load', () => {
            addTrackLayers();
        });
    }, [lng, lat, zoom, theme, addTrackLayers]);

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
