import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useTranslation} from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";


const RegistrationForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reenteredPassword, setPasswordReenteredPassword] = useState('');

    const [usernameWarning, setUsernameWarning] = useState(0);
    const [passwordWarning, setPasswordWarning] = useState(0);
    const [reinputtedPasswordWarning, setReinputtedPasswordWarning] =
        useState(0);
    const [rerenderingCause, setRerenderingCause] =
        useState(-1);
    const history = useHistory();
    const { t } = useTranslation();
    const usernameWarnings = [
        '',
        t("registration.empty_username_warning"),
        t("registration.username_spaces_warning"),
        t("registration.non_appropriate_symbols_username_warning")
    ]
    const passwordWarnings = [
        '',
        t("registration.short_password_warning")
    ]
    const reinputtedPasswordWarnings = [
        '',
        t("registration.different_passwords_warning")
    ]
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
    }));

    const classes = useStyles();

    const rerenderingReason = {
        USERNAME: 0,
        PASSWORD: 1,
        REENTERED_PASSWORD: 2,
        SERVER_RESPONSE: 3
    }

    useEffect( () => {
        const validateForm = async () => {
            switch (rerenderingCause) {
                case rerenderingReason.USERNAME:
                    checkUsername();
                    break;
                case rerenderingReason.PASSWORD:
                case rerenderingReason.REENTERED_PASSWORD:
                    checkPassword();
                    checkReEnteredPassword();
                    break;
            }
        }
        validateForm();
    });

    const checkUsername = () => {
        if (username.trim() === '') {
            setUsernameWarning(1);
        } else if (username.indexOf(' ') !== -1) {
            setUsernameWarning(2);
        } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
            setUsernameWarning(3);
        } else {
            setUsernameWarning(0);
        }
    }

    const checkPassword = () => {
        if (password.length < 8) {
            setPasswordWarning(1);
        } else {
            setPasswordWarning(0);
        }
    }

    const checkReEnteredPassword = () => {
        if (password !== reenteredPassword) {
            setReinputtedPasswordWarning(1);
        } else {
            setReinputtedPasswordWarning(0);
        }
    }

    const dataIsCorrect = () => {
        return !usernameWarning && !passwordWarning && !reinputtedPasswordWarning;
    }

    const handleUserCreationError = (responseData) => {
        if (responseData['username']) {
            let message = '';
            responseData['username'].map(item => message += item + ' ');
            setRerenderingCause(rerenderingReason.SERVER_RESPONSE);
            setUsernameWarning(message);
        }
        if (responseData['password']) {
            let message = '';
            responseData['password'].map(item => message += item + ' ');
            setRerenderingCause(rerenderingReason.SERVER_RESPONSE);
            setPasswordWarning(message);
        }
    }

    const sendUserRegistrationRequest = event => {
        event.preventDefault();
        if (!dataIsCorrect()) {
            return;
        }

        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_REGISTRATION_API;
        const requestData = {
            'username': username,
            'password': password,
            're_password': reenteredPassword
        };
        props.requestManager.makePostRequest(requestApi, {}, requestData)
            .then(_ => setRegistrationSuccess(true))
            .catch(error => handleUserCreationError(error.response.data));
    }

    const goToAuthorization = () =>{
        let path = 'login';
        history.push(path);
    }

    return (
        <div className={classes.root}>
            <Paper elevation={3} className='auth_container'>
                <div id='title_text'>
                    {t("registration.registration")}
                </div>
                <form onSubmit={sendUserRegistrationRequest}>
                    <div className='auth-form-group'>
                        <TextField
                            className='auth-form-input'
                            required
                            label={t("registration.username")}
                            placeholder='username'
                            onChange={event => {
                                setUsername(event.target.value);
                                setRerenderingCause(rerenderingReason.USERNAME);
                            }}
                            helperText={typeof(usernameWarning) === "string"
                                ? usernameWarning
                                : usernameWarnings[usernameWarning]
                            }
                            error={typeof(usernameWarning) === "string"
                                ? usernameWarning
                                : usernameWarnings[usernameWarning]
                            }
                        />
                    </div>
                    <div className='auth-form-group'>
                        <TextField
                            className='auth-form-input'
                            required
                            type="password"
                            label={t("registration.password")}
                            placeholder='kshjds832KFj,d?lk4$2d'
                            onChange={event => {
                                setPassword(event.target.value);
                                setRerenderingCause(rerenderingReason.PASSWORD);
                            }}
                            helperText={typeof(passwordWarning) === "string"
                                ? passwordWarning
                                : passwordWarnings[passwordWarning]
                            }
                            error={typeof(passwordWarning) === "string"
                                ? passwordWarning
                                : passwordWarnings[passwordWarning]
                            }
                        />
                    </div>
                    <div className='auth-form-group'>
                        <TextField
                            className='auth-form-input'
                            required
                            type="password"
                            label={t("registration.password_reentering")}
                            placeholder='kshjds832KFj,d?lk4$2d'
                            onChange={event => {
                                setPasswordReenteredPassword(event.target.value);
                                setRerenderingCause(rerenderingReason.REENTERED_PASSWORD);
                            }}
                            helperText={reinputtedPasswordWarnings[reinputtedPasswordWarning]}
                            error={reinputtedPasswordWarnings[reinputtedPasswordWarning]}
                        />
                    </div>
                    <div className='auth-button'>
                        <Button variant="contained" color="primary"
                                type='submit'>
                            {t("registration.register")}
                        </Button>
                    </div>
                </form>
            </Paper>
            {
                registrationSuccess &&
                    <Dialog
                        open={registrationSuccess}
                        onClose={() => {
                            setRegistrationSuccess(false);
                            goToAuthorization();
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {t("registration.success_registration")}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={() => {
                                setRegistrationSuccess(false);
                                goToAuthorization();
                            }} color="primary" autoFocus>
                                {t("registration.ok")}
                            </Button>
                        </DialogActions>
                    </Dialog>
            }
        </div>
    )
}

export default RegistrationForm;