import { useState } from "react";

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    function handleLogin(e) {
        e.preventDefault();

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }).then((response) => {
            if (response.status === 200) {
                props.setLoggedIn(true);
            } else if (response.status === 401) {
                setErrorMessage("Incorrect password.")
            } else if (response.status === 404) {
                setErrorMessage("The user has not been found, but it has now been created. \n Log in again with the same credentials.")
            }
        });
    }

    return (
        <form>
            {errorMessage === "" ? <></> : <div>{errorMessage}</div> }
            <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={(e) => handleLogin(e)}>Login</button>
        </form>
    );
}
