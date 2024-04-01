'use client';

import { SharedTrack, Track } from '@/lib/type';
import mapboxgl from 'mapbox-gl';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useTrackStore } from '@/providers/TrackStoreProvider';
import { generateRandomColor } from '@/lib/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_KEY ?? '';

export default function MapWrapper({
    myTrackData,
    allTrackData,
}: {
    myTrackData: Track[];
    allTrackData: SharedTrack[];
}) {
    // Local states for the map
    const [lng, setLng] = useState<number>(7.161);
    const [lat, setLat] = useState<number>(47.319);
    const [zoom, setZoom] = useState<number>(5);
    const [currentLayers, setCurrentLayers] = useState<SharedTrack[]>([]);

    // State indicating whether the map has loaded the corresponding style
    const [mapStyleLoaded, setMapStyleLoaded] = useState<boolean>(false);

    // Ref for the map to avoid unnecessary rerender
    const mapContainer = useRef(null);
    const map = useRef<mapboxgl.Map | null>(null);

    // Next.js router instance
    const router = useRouter();

    // Retrieve states and actions from Zustand store, including
    // 1. State of data to show on the map, either "my tracks" or "all tracks"
    // 2. State of whether a new track has just been successfully uploaded
    // 3. State of the track to be viewed in detail (zoom in) mode
    const {
        dataToShow,
        justUploaded,
        setJustUploadedFalse,
        trackToView,
        setTrackToView,
    } = useTrackStore((state) => state);
    // Retrieve the current state of the app theme
    const { theme } = useTheme();

    // Cache the result of different tracks between 'my tracks' and 'all tracks' for better performance
    const diffLayers = useMemo(() => {
        const myTrackSlugs = myTrackData.map((track) => track.slug);
        const diffSlugs = allTrackData
            .map((track) => track.accessList.accessToTrack.slug)
            .filter((slug) => !myTrackSlugs.includes(slug));
        return new Set(diffSlugs);
    }, [myTrackData, allTrackData]);

    // Effect to synchronize store state to zoomIn and zoomOut
    useEffect(() => {
        if (map.current && trackToView !== '') {
            const target = allTrackData.find(
                (t) => t.accessList.accessToTrack.slug === trackToView,
            );
            if (target) {
                const geoJson = JSON.parse(
                    target.accessList.accessToTrack.path,
                );
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
            }
        } else if (map.current && trackToView === '') {
            map.current.flyTo({
                center: [lng, lat],
                zoom: zoom,
            });
        }
    }, [trackToView, allTrackData, lat, lng, zoom]);

    // Function to add a single layer to the map
    const addLayer = useCallback(
        (track: SharedTrack) => {
            const geoJson = JSON.parse(track.accessList.accessToTrack.path);
            map.current?.addSource(track.accessList.accessToTrack.slug, {
                type: 'geojson',
                data: geoJson,
            });

            map.current?.addLayer({
                id: track.accessList.accessToTrack.slug,
                type: 'line',
                source: track.accessList.accessToTrack.slug,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': generateRandomColor(),
                    'line-width': 6,
                },
            });
            map.current?.addLayer({
                id: `${track.accessList.accessToTrack.slug}-fill`,
                type: 'fill',
                source: track.accessList.accessToTrack.slug,
                paint: {
                    'fill-color': 'transparent',
                    'fill-outline-color': 'transparent',
                },
            });

            if (
                diffLayers.has(track.accessList.accessToTrack.slug) &&
                dataToShow === 'my'
            ) {
                map.current?.setLayoutProperty(
                    track.accessList.accessToTrack.slug,
                    'visibility',
                    'none',
                );
                map.current?.setLayoutProperty(
                    `${track.accessList.accessToTrack.slug}-fill`,
                    'visibility',
                    'none',
                );
            }

            // Create a popup for the track on hover
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'track-popup',
            });

            map.current?.on(
                'mouseenter',
                `${track.accessList.accessToTrack.slug}-fill`,
                (event) => {
                    map.current!.getCanvas().style.cursor = 'pointer';
                    map.current!.setPaintProperty(
                        track.accessList.accessToTrack.slug,
                        'line-width',
                        8,
                    );

                    const coords = event.lngLat; // Capture mouse pointer lng lat to show popup

                    // Implement popup with raw html
                    popup
                        .setLngLat(coords)
                        .setHTML(
                            `<div class="popup-container">
                            <div class="popup-up">${track.accessList.accessToTrack.slug}</div>
                            <div class="popup-author">By: ${track.accessList.accessToTrack.owner.username}</div>
                            <div class="popup-main">
                            <div>Distance: ${track.accessList.accessToTrack.distance}</div>
                            <div>Elevation: ${track.accessList.accessToTrack.elevation}</div>
                            </div>
                            </div>`,
                        )
                        .addTo(map.current!);
                },
            );

            map.current?.on(
                'mouseleave',
                `${track.accessList.accessToTrack.slug}-fill`,
                () => {
                    map.current!.getCanvas().style.cursor = '';
                    map.current!.setPaintProperty(
                        track.accessList.accessToTrack.slug,
                        'line-width',
                        6,
                    );
                    // Remove popup on mouse leave
                    popup.remove();
                },
            );

            map.current?.on(
                'click',
                `${track.accessList.accessToTrack.slug}-fill`,
                () => {
                    // Set state to be name of the track to be viewed in detail
                    setTrackToView(track.accessList.accessToTrack.slug);
                    router.push(`/main/${track.accessList.accessToTrack.slug}`);
                },
            );
        },
        [dataToShow, diffLayers, router, setTrackToView],
    );

    // Effect to add the uploaded track as a new layer to the map
    useEffect(() => {
        if (mapStyleLoaded && justUploaded) {
            const diff = allTrackData.filter(
                (layer) =>
                    !currentLayers
                        .map((l) => l.accessList.accessToTrack.slug)
                        .includes(layer.accessList.accessToTrack.slug),
            );
            if (diff.length !== 0) {
                // Call addLayer to add the newly uploaded track to the map
                addLayer(diff[0]);
                // Update the local state for all map layers
                setCurrentLayers([...currentLayers, diff[0]]);
                // Reset the justUploaded state to false
                setJustUploadedFalse();
            }
        }
    }, [
        allTrackData,
        mapStyleLoaded,
        currentLayers,
        addLayer,
        justUploaded,
        setJustUploadedFalse,
    ]);

    // Function to add all track data the user has access to as map layers
    // When user is viewing my tracks on first render, all layers of shared tracks will be hidden
    const addLayersAllTrackData = useCallback(() => {
        allTrackData.forEach((track) => {
            addLayer(track);
        });
        // Store the state of all layers
        setCurrentLayers(allTrackData);
    }, [allTrackData, addLayer]);

    // Function to show all different layers between 'my tracks' and 'all tracks'
    const showAllDiffLayers = useCallback(() => {
        for (const slug of diffLayers) {
            if (map.current) {
                map.current.setLayoutProperty(slug, 'visibility', 'visible');
                map.current.setLayoutProperty(
                    `${slug}-fill`,
                    'visibility',
                    'visible',
                );
            }
        }
    }, [diffLayers]);

    // Function to show hide different layers between 'my tracks' and 'all tracks'
    const hideAllDiffLayers = useCallback(() => {
        for (const slug of diffLayers) {
            if (map.current) {
                map.current.setLayoutProperty(slug, 'visibility', 'none');
                map.current.setLayoutProperty(
                    `${slug}-fill`,
                    'visibility',
                    'none',
                );
            }
        }
    }, [diffLayers]);

    // Effect to initialize the map
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

        // Attach an event listener to listen for the initial map load
        map.current.on('load', () => {
            addLayersAllTrackData();
        });

        // Attach an event listener to listen for style.load event
        map.current.on('style.load', () => {
            // Set the state of map style loaded to true
            setMapStyleLoaded(true);
            addLayersAllTrackData();
        });

        // Add control widgets to the map
        map.current.addControl(
            new mapboxgl.NavigationControl({ showCompass: false }),
        );
        map.current.addControl(
            new mapboxgl.FullscreenControl({
                container: document.querySelector('body'),
            }),
        );
    }, [lng, lat, zoom, theme, addLayersAllTrackData]);

    // Effect to show and hide the map layers when user switch between 'my tracks' and 'all tracks'
    useEffect(() => {
        if (map.current && mapStyleLoaded) {
            if (dataToShow === 'all') {
                // Show diff layers
                showAllDiffLayers();
            } else if (dataToShow === 'my') {
                // Hide diff layers
                hideAllDiffLayers();
            }
        }
    }, [dataToShow, showAllDiffLayers, hideAllDiffLayers, mapStyleLoaded]);

    // Effect to synchronize map theme to global app theme
    useEffect(() => {
        if (map.current) {
            // Set the state of map style loaded to false,
            // the state will be set to true when the style.loaded event listener fires
            setMapStyleLoaded(false);
            map.current.setStyle(
                theme === 'dark'
                    ? 'mapbox://styles/mapbox/dark-v11'
                    : 'mapbox://styles/mapbox/outdoors-v11',
            );
        }
    }, [theme]);

    return (
        <div className='hidden h-screen flex-1 sm:block'>
            <div className='h-full w-full' ref={mapContainer} />
        </div>
    );
}
