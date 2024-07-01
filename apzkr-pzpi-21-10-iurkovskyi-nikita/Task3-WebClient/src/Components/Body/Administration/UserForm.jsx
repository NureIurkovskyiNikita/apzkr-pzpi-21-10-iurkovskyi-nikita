import TextField from "@material-ui/core/TextField";
import React from "react";
import {useTranslation} from "react-i18next";

const UserForm = (props) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.username")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'username', props.setUserData
                        )
                    }
                    defaultValue={
                        props.users ? props.users[props.openedIndex].username : ''
                    }
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.password")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'password', props.setUserData
                        )
                    }
                    defaultValue={
                        props.users ? props.users[props.openedIndex].password : ''
                    }
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.is_vip")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'is_VIP', props.setUserData
                        )
                    }
                    defaultValue={
                        props.users ? props.users[props.openedIndex].is_VIP : ''
                    }
                    required
                />
            </div>
        </div>
    )
}

export default UserForm;