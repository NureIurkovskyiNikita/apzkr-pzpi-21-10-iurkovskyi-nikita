import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";
import {useTranslation} from "react-i18next";

const DishForm = (props) => {
    const { t } = useTranslation();

    return(
        <div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.name")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'name', props.setDishData
                        )
                    }
                    defaultValue={
                        props.dishes ? props.dishes[props.openedIndex].name : ''
                    }
                    required
                />
            </div>

            <div className='entity-dialog-item'>
                <div>
                    {t("administration.description")}:
                </div>
                <TextField
                    multiline
                    fullWidth={100}
                    defaultValue={props.dishes ? props.dishes[props.openedIndex].description : ''}
                    required
                    onChange={event =>
                        props.handleData(event, props.newData,
                            'description', props.setDishData)}
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.type")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(event, props.newData,
                            'type', props.setDishData)}
                    defaultValue={props.dishes ? props.dishes[props.openedIndex].type : ''}
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.popularity")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(event, props.newData,
                            'popularity', props.setDishData)}
                    defaultValue={props.dishes ? props.dishes[props.openedIndex].popularity : ''}
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.rate")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(event, props.newData,
                            'rate', props.setDishData)}
                    defaultValue={props.dishes ? props.dishes[props.openedIndex].rate : 0}
                    required
                />
            </div>
        </div>
    )
}

export default DishForm;