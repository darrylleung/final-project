import { useForm } from "./hooks/handle-form";
import { useState } from "react";

export default function Menu(props) {
    const { menuIsVisible } = props;
    const [rules, setRules] = useState(false);
    const [lead, setLead] = useState(false);
    // const [leaderboard, setLeaderboard] = useState(false);
  
    return (
        <div className={`menu ${menuIsVisible ? "showMenu" : "closeMenu"}`}>
            <div className="rules-logged-in">
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
                    {lead && <span className="underconstruction">Feature in progress!</span>}
                </div>
            </div>
            <div className="logout">
                <form method="post" action="/logout">
                    <button className="logout">Log Out</button>
                </form>
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
