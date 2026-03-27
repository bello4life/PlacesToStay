import React, { useState } from "react";
import SearchComponent from "./SearchComponent";
import ResultsComponent from "./ResultsComponent";

export interface Accommodation {
    ID: number;
    name: string;
    type: string;
    location: string;
    latitude: number;
    longitude: number;
}

export default function App() {
    const [results, setResults] = useState<Accommodation[]>([]);
    const [bookingMessage, setBookingMessage] = useState("");

    return (
        <div>
            <h1>Places To Stay</h1>
            <SearchComponent onResults={setResults} />
            {bookingMessage && <p>{bookingMessage}</p>}
            <ResultsComponent results={results} onBookingMessage={setBookingMessage} />
        </div>
    );
}
