import React from "react";
import { Accommodation } from "./App";

interface SearchComponentProps {
    onResults: (results: Accommodation[]) => void;
}

export default function SearchComponent({ onResults }: SearchComponentProps) {

 

    function searchAccommodation() {
        const location = (document.getElementById("location") as HTMLInputElement).value;
        fetch(`/accommodation/${location}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                onResults(data);
            });
}

    return (
        <div>
            <h2>Search for accommodation</h2>
            <input type="text" id="location" placeholder="Enter a location" />
            <button onClick={searchAccommodation}>Search</button>
        </div>
    );
}
