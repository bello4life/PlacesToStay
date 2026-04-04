import React, { useState, useEffect } from "react";
import SearchComponent from "./SearchComponent";
import ResultsComponent from "./ResultsComponent";
import MapComponent from "./MapComponent";
import LoginComponent from "./LoginComponent";

export interface Accommodation {
    ID: number;
    name: string;
    type: string;
    location: string;
    latitude: number;
    longitude: number;
    description: String
}

export default function App() {
    const [results, setResults] = useState<Accommodation[]>([]);
    const [bookingMessage, setBookingMessage] = useState("");
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        fetch('/login')
            .then(response => response.json())
            .then(data => setUsername(data.username));
    }, []);

    return (
        <div>
            <h1>Places To Stay</h1>
            <LoginComponent
                username={username}
                onLogin={setUsername}
                onLogout={() => setUsername(null)}
            />
            <SearchComponent onResults={setResults} />
            {bookingMessage && <p>{bookingMessage}</p>}
            <ResultsComponent results={results} onBookingMessage={setBookingMessage} />
            <MapComponent results={results} />
        </div>
    );
}
