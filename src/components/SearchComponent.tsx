import React from "react";
import { Accommodation } from "./App";

interface SearchComponentProps {
    onResults: (results: Accommodation[]) => void;
}

export default function SearchComponent({ onResults }: SearchComponentProps) {
    function searchAccommodation() {
        const location = (
            document.getElementById("location") as HTMLInputElement
        ).value;
        const type = (document.getElementById("type") as HTMLSelectElement)
            .value;

        const url =
            type === "all"
                ? `/accommodation/${location}`
                : `/accommodation/${location}/${type}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => onResults(data));
    }

    return (
        <div className="search-row" onKeyDown={e => e.key === "Enter" && searchAccommodation()}>
            <input type="text" id="location" placeholder="Where to? (e.g. Hampshire)" />
            <select id="type" defaultValue="all">
                <option value="all">All types</option>
                <option value="hotel">Hotel</option>
                <option value="BandB">B&B</option>
                <option value="pub">Pub</option>
                <option value="campsite">Campsite</option>
            </select>
            <button onClick={searchAccommodation}>Search</button>
        </div>
    );
}
