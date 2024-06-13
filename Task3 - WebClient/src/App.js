import './App.css';
import './styles/auth.css';
import {BrowserRouter, Redirect, Route} from "react-router-dom";
import Header from './Components/Header/header';
import LogInForm from "./Components/Body/Authentication/Authorization";
import RegistrationForm from "./Components/Body/Authentication/Registration";
import RequestManager from "./Components/AuxiliaryComponents/RequestManager";
import 'dotenv';
import {createMuiTheme} from "@material-ui/core/styles";
import { ThemeProvider } from '@material-ui/core/styles';
import React, {useEffect, useState} from "react";
import Catalog from "./Components/Body/Catalog/Catalog";
import DishSearcher from "./Components/Body/Searchers/DishSearcher";
import CateringEstablishmentSearcher from "./Components/Body/Searchers/CateringEstablishmentSearcher";
import AdministrationPage from "./Components/Body/Administration/AdministrationPage";
import Dish from "./Components/Body/Catalog/Dish";
import { useTranslation } from "react-i18next";
import "./i18n";
import i18n from "i18next";

const myTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#263238'
        },
        secondary: {
            main: '#e58c00',
            contrastText: '#ffffff',
        },
        sideMenu: {
            main: '#455a64'
        },
        yellow: {
            main: '#C39628'
        }
    }
});

function App() {
    const requestManager = new RequestManager();
    const [authStatus, setAuthStatus] = useState(false);

    const checkAuthStatus = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_ACCESS_TOKEN_VERIFICATION;
        const requestData = {
            'token': localStorage.getItem('fap_access')
        };
        requestManager.makePostRequest(requestApi, {}, requestData)
            .then(_ => {
                setAuthStatus(true)
            });
    }

    const specifyLanguage = () => {
        let usedLanguage = localStorage.getItem('fap-language');
        if (!usedLanguage) {
            localStorage.setItem('fap-language', 'ua');
            usedLanguage = 'ua';
        }
        i18n.changeLanguage(usedLanguage);
    }

    useEffect(() => {
        checkAuthStatus();
    })

    specifyLanguage();

    return (
        <div className="App" id='content_wrapper'>
            <ThemeProvider theme={myTheme}>
                <BrowserRouter>
                    <Route
                        component={() =>
                            <Header
                                authStatus={authStatus}
                                authStatusChanger={setAuthStatus} />
                        }
                        path='/'
                    />
                    <Route
                        component={() =>
                            <LogInForm
                                requestManager={requestManager}
                                authStatusChanger={setAuthStatus} />
                        }
                        path='/login'
                    />
                    <Route
                        component={() =>
                            <RegistrationForm
                                requestManager={requestManager} />
                        }
                        path='/register'
                    />
                    <Route
                        exact component={() =>
                            <Catalog
                                requestManager={requestManager}/>
                        }
                        path='/catalog'
                    />
                    <Route exact path='/' >
                        <Redirect to='/catalog' />
                    </Route>
                    <Route
                        component={() =>
                            <Dish
                                requestManager={requestManager} />
                        }
                        path='/catalog/:id'
                    />
                    <Route
                        component={() =>
                            <DishSearcher
                                requestManager={requestManager} />
                        }
                        path='/dish_searcher'
                    />
                    <Route
                        component={() =>
                            <CateringEstablishmentSearcher
                                requestManager={requestManager} />
                        }
                        path='/catering_establishment_searcher'
                    />
                    <Route
                        component={() =>
                            <AdministrationPage
                                requestManager={requestManager} />
                        }
                        path='/admin'
                    />
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default App;
