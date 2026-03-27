import React from "react";
import { Accommodation } from "./App";

interface ResultsComponentProps {
    results: Accommodation[];
    onBookingMessage: (message: string) => void;
}

export default function ResultsComponent({ results, onBookingMessage }: ResultsComponentProps) {

 function bookAccommodation(accID: number) {
    fetch('/accommodation/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            apiID: '0x574144',
            accID: accID,
            date: 260603,
            userID: 1,
            people: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.id) {
            onBookingMessage(`Booking confirmed! Booking ID: ${data.id}`);
        } else {
            onBookingMessage(`Booking failed: ${data.error}`);
        }
    });
}

    const resultsList = results.map(acc =>
        <li key={acc.ID}>
            <strong>{acc.name}</strong> - {acc.type} - {acc.location}
            <button onClick={() => bookAccommodation(acc.ID)}>Book</button>
        </li>
    );

    return (
        <div>
            <h2>Results</h2>
            <ul>{resultsList}</ul>
        </div>
    );
}
