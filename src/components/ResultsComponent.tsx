import React from "react";
import { Accommodation } from "./App";

interface ResultsComponentProps {
    results: Accommodation[];
    onBookingMessage: (message: string) => void;
}

export default function ResultsComponent({ results, onBookingMessage }: ResultsComponentProps) {


    function bookAccommodation(accID: number) {
        const dateInput = (document.getElementById(`date-${accID}`) as HTMLInputElement).value;
        const people = parseInt((document.getElementById(`people-${accID}`) as HTMLInputElement).value);

        if (!dateInput) {
            onBookingMessage("Please select a date before booking.");
            return;
        }

        
        const parts = dateInput.split('-');
        const yymmdd = parseInt(parts[0].slice(2) + parts[1] + parts[2]);

        fetch('/accommodation/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accID: accID,
                date: yymmdd,
                people: people
            })
        })
        .then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    onBookingMessage(`Booking confirmed! Your booking ID is ${data.id}.`);
                });
            } else if (response.status === 401) {
                onBookingMessage("You need to be logged in to make a booking.");
            } else if (response.status === 400) {
                response.json().then(data => {
                    onBookingMessage(`Booking failed: ${data.error}`);
                });
            } else {
                onBookingMessage("Something went wrong on our end. Please try again later.");
            }
        });
    }


    const resultsList = results.map(acc =>
        <li key={acc.ID}>
            <strong>{acc.name}</strong> - {acc.type} - {acc.location}
            <br />
            <label>Date: </label>
            <input type="date" id={`date-${acc.ID}`} />
            <label> People: </label>
            <input type="number" id={`people-${acc.ID}`} defaultValue="1" min="1" style={{ width: "60px" }} />
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
