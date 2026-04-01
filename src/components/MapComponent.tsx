import { useRef, useEffect } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Accommodation } from './App';

interface MapComponentProps {
    results: Accommodation[];
}

export default function MapComponent({ results }: MapComponentProps) {
    const map = useRef<L.Map | null>(null);
    const markers = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (map.current == null) {
            map.current = L.map("map1");

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                { attribution: "Copyright OSM contributors, ODBL" }
            ).addTo(map.current);

            map.current.setView(L.latLng(51.05, -0.72), 10);
        }



        markers.current.forEach(marker => marker.remove());
        markers.current = [];

    

        results.forEach(acc => {
            const marker = L.marker(L.latLng(acc.latitude, acc.longitude))
                .bindPopup(`<b>${acc.name}</b><br>${acc.description}`)
                .addTo(map.current!);
            markers.current.push(marker);
        });

        if (results.length > 0) {
            map.current.setView(L.latLng(results[0].latitude, results[0].longitude), 10);
        }

    }, [results]);
    

    return (
        <div id="map1" style={{ width: "800px", height: "600px" }}></div>
    );
}