import ReactDOM from "react-dom";
import App from "./app";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducer";
import { Provider } from "react-redux";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// there will be a fetch here to check whether the user has a cookiesession
// if they have a cookie, they will be directed to the winning puzzle page, plus their scorecard
// if they do not have a cookie, they will be directed to the empty game state in App

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector("main")
);
