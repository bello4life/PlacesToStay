import React, { useState } from "react";

interface LoginComponentProps {
    username: string | null;
    onLogin: (username: string) => void;
    onLogout: () => void;
}


export default function LoginComponent({ username, onLogin, onLogout }: LoginComponentProps) {

    function login() {
        const user = (document.getElementById('username') as HTMLInputElement).value;
        
        const pass = (document.getElementById('password') as HTMLInputElement).value;
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        })

        .then(response => {
            if (response.status === 200) {
                response.json().then(data => onLogin(data.username));
            } else {
                alert('Incorrect username or password. Please try again.');

            }
        });
    }


    function logout() {
        fetch('/logout', { method: 'POST' })
            .then(() => onLogout());
    }

    if (username) {
        return (
            <div>
                <p>Logged in as {username}</p>
                <button onClick={logout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Login</h2>
            <input type='text' id='username' placeholder='Username' />
            <input type='password' id='password' placeholder='Password' />
            <button onClick={login}>Login</button>
        </div>
    );
}
