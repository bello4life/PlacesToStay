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
        .then(response => {
            if(response.status === 200) {
                response.json().then(data => {
                    onBookingMessage(`Booking confirmed! Your booking ID is ${data.id}.`);
                });
            } else if(response.status === 400) {
                onBookingMessage("Sorry, we could not complete your booking. Please check your details and try again.");
            } else if(response.status === 403) {
                onBookingMessage("Sorry, you are not authorised to make this booking.");
            } else {
                onBookingMessage("Something went wrong on our end. Please try again later.");
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
