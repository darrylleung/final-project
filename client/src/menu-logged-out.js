import { useForm } from "./hooks/handle-form";
import { useState } from "react";

export default function Menu(props) {
    const { menuIsVisible } = props;
    const [values, handleChange] = useForm();
    const [error, setError] = useState(false);
    const [reg, setReg] = useState(false);
    const [log, setLog] = useState(false);
    const [rules, setRules] = useState(false);
    const [lead, setLead] = useState(false);
    // const [leaderboard, setLeaderboard] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("User wants to send data to the server and set password.");
        // console.log("Data the user submitted: ", values);

        if (
            values == null ||
            values === " " ||
            values.username == null ||
            values.username == " " ||
            values.email == null ||
            values.email === " " ||
            values.password == null ||
            values.password == " "
        ) {
            return setError(true);
        } else {
            console.log("Data the user submitted: ", values);

            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((res) => res.json())
                .then((data) => {
                    data.success ? location.replace("/") : setError(true);
                })
                .catch((err) => {
                    console.log("err with registration or login: ", err);
                    setError(true);
                });
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("User wants to send data to the server and set password.");
        // console.log("Data the user submitted: ", values);

        if (
            values == null ||
            values === " " ||
            values.email == null ||
            values.email === " " ||
            values.password == null ||
            values.password == " "
        ) {
            return setError(true);
        } else {
            console.log("Data the user submitted: ", values);

            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((res) => res.json())
                .then((data) => {
                    data.success ? location.replace("/") : setError(true);
                })
                .catch((err) => {
                    console.log("err with registration or login: ", err);
                    setError(true);
                });
        }
    };

    // const clickReg = () => {
    //     if (!reg) {
    //         setReg(true);
    //     } else {
    //         setReg(false);
    //     }
    // };

    // const clickLog = () => {
    //     if (!log) {
    //         setLog(true);
    //     } else {
    //         setLog(false);
    //     }
    // };

    return (
        <div className={`menu ${menuIsVisible ? "showMenu" : "closeMenu"}`}>
            <div className="registration">
                <span
                    className="registration"
                    onClick={() => {
                        if (log) {
                            setLog(!log);
                        }
                        setReg(!reg);
                    }}
                >
                    Register
                </span>
                <div
                    className={`register-form ${
                        reg ? "showForm" : "closeForm"
                    }`}
                >
                    {error && <div>Error registering 🚨</div>}
                    {reg && (
                        <form className="registration">
                            <input
                                className="registration"
                                autoComplete="off"
                                name="username"
                                placeholder="Username"
                                type="text"
                                onChange={handleChange}
                            />
                            <input
                                className="registration"
                                autoComplete="off"
                                name="email"
                                placeholder="E-mail"
                                type="text"
                                onChange={handleChange}
                            />
                            <input
                                className="registration"
                                autoComplete="off"
                                name="password"
                                placeholder="Password"
                                type="password"
                                onChange={handleChange}
                            />
                            <button
                                className="menu-submit"
                                onClick={handleRegister}
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <div className="login">
                <span
                    className="login"
                    onClick={() => {
                        if (reg) {
                            setReg(!reg);
                        }
                        setLog(!log);
                    }}
                >
                    Login
                </span>
                <div className={`login-form ${log ? "showForm" : "closeForm"}`}>
                    {error && <div>Error logging in 🚨</div>}
                    {log && (
                        <form className="login">
                            <input
                                className="login"
                                autoComplete="off"
                                name="email"
                                placeholder="Email"
                                type="text"
                                onChange={handleChange}
                            />
                            <input
                                className="login"
                                autoComplete="off"
                                name="password"
                                placeholder="Password"
                                type="password"
                                onChange={handleChange}
                            />
                            <button
                                className="menu-submit"
                                onClick={handleLogin}
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <div className="rules">
                <span className="rules" onClick={() => setRules(!rules)}>
                    Rules
                </span>
                <div
                    className={`rules-comp ${rules ? "showForm" : "closeForm"}`}
                >
                    {rules && (
                        <ul>
                            <li>
                                Guess words to uncover the redacted paragraph
                            </li>
                            <li>
                                Stuck? Use a <strong>hint</strong>
                            </li>
                            <li>
                                Register an account to compete on the
                                leaderboard
                            </li>
                            <li>
                                Scoring: 1 point for each guess, 2 points for
                                each hint, try to get as <strong>low</strong> a
                                score as possible
                            </li>
                        </ul>
                    )}
                </div>
            </div>
            <div className="leaderboard">
                <span className="leaderboard" onClick={() => setLead(!lead)}>
                    Leaderboard
                </span>
                <div
                    className={`leaderboard-comp ${
                        lead ? "showForm" : "closeForm"
                    }`}
                >
                    {lead && (
                        <span className="underconstruction">
                            Feature in progress!
                        </span>
                    )}
                </div>
            </div>
            <a
                href="https://developer.nytimes.com/"
                target="_blank"
                rel="noreferrer"
                className="nyt-branding"
            >
                <img src="./poweredby_nytimes_200a.png" />
            </a>
        </div>
    );
}
