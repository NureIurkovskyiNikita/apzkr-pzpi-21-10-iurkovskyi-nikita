// import { Form, Button } from 'react-bootstrap';
import React, {useEffect, useState} from "react";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useTranslation} from "react-i18next";
import { useHistory } from 'react-router-dom';


const LogInForm = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [credentialsValidityWarning, setCredentialsValidityWarning] =
        useState(0);
    const { t } = useTranslation();
    const history = useHistory();
    const validness_warning = [
        '',
        t("authorization.user_does_not_exist_warning"),
    ];

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
        },
    }));

    const classes = useStyles();

    const handleAuthenticationError = () => {
        setCredentialsValidityWarning(1);
    }

    const saveUserCredentials = (responseData) => {
        localStorage.setItem('fap_access', responseData.access);
        localStorage.setItem('fap_refresh', responseData.refresh);
        props.authStatusChanger(true);
        setCredentialsValidityWarning('');
    }

    const authenticate = event => {
        event.preventDefault();

        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_LOGIN_API;
        const requestData = {
            'username': username,
            'password': password
        }
        props.requestManager.makePostRequest(requestApi, {}, requestData)
            .then((response) => {
                saveUserCredentials(response.data);
                goToCatalog();
            })
            .catch(error => {
                handleAuthenticationError(error.response.data)
            });
    }

    const goToCatalog = () =>{
        let path = 'catalog';
        history.push(path);
    }

    return (
        <div className={classes.root}>
            <Paper elevation={3} className='auth_container'>
                <div id='title_text'>
                    {t("authorization.authorization")}
                </div>
                <form onSubmit={authenticate}>
                    <div className='auth-form-group'>
                        <TextField
                            className='auth-form-input'
                            required
                            label={t("authorization.username")}
                            placeholder='username'
                            onChange={event => {
                                setUsername(event.target.value);
                                setCredentialsValidityWarning(0)
                            }}
                            error={validness_warning[credentialsValidityWarning]}
                        />
                    </div>
                    <div className='auth-form-group'>
                        <TextField
                            className='auth-form-input'
                            required
                            label={t("authorization.password")}
                            type="password"
                            placeholder='kshjds832KFj,d?lk4$2d'
                            onChange={event => {
                                setPassword(event.target.value);
                                setCredentialsValidityWarning(0)
                            }}
                            helperText={validness_warning[credentialsValidityWarning]}
                            error={validness_warning[credentialsValidityWarning]}
                        />
                    </div>
                    <div className='auth-button'>
                        <Button variant="contained" color="primary"
                                type='submit'>
                            {t("authorization.login")}
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    )
}

export default LogInForm;