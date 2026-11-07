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
    description: string;
}

export default function App() {
    const [results, setResults] = useState<Accommodation[]>([]);
    const [bookingMessage, setBookingMessage] = useState("");
    const [username, setUsername] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        fetch("/login")
            .then((response) => response.json())
            .then((data) => setUsername(data.username));
    }, []);

    function handleResults(newResults: Accommodation[]) {
        setResults(newResults);
        setSearched(true);
    }

    return (
        <div className="app">
            <header className="topbar">
                <h1>Places To Stay</h1>
                <LoginComponent
                    username={username}
                    onLogin={setUsername}
                    onLogout={() => setUsername(null)}
                />
            </header>

            <div className="searchbar">
                <SearchComponent onResults={handleResults} />
            </div>

            <main className="content">
                <section className="results-panel">
                    {bookingMessage && <p>{bookingMessage}</p>}
                    {searched && results.length === 0 ? (
                        <p>
                            No accommodation found for your search. Please try a
                            different location or type.
                        </p>
                    ) : (
                        <ResultsComponent
                            results={results}
                            onBookingMessage={setBookingMessage}
                        />
                    )}
                </section>
                <section className="map-panel">
                    <MapComponent results={results} />
                </section>
            </main>
        </div>
    );
}
