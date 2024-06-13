import TextField from "@material-ui/core/TextField";
import React from "react";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";


const CateringEstablishmentForm = (props) => {
    const { t } = useTranslation();

    return (
        <div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.name")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'name', props.setCateringEstablishmentData
                        )
                    }
                    defaultValue={
                        props.catering_establishment ? props.catering_establishment[props.openedIndex].name : ''
                    }
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.establishment_code")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'establishment_code', props.setCateringEstablishmentData
                        )
                    }
                    defaultValue={
                        props.catering_establishment ? props.catering_establishment[props.openedIndex].establishment_code : ''
                    }
                    required
                />
            </div>
            <div className='entity-dialog-item'>
                <div>
                    {t("administration.image")}:
                </div>
                <div>
                    <div>
                        <div>
                            {t("administration.current")}:
                        </div>
                        <div>
                            {props.dishes ? props.dishes[props.openedIndex].image : ''}
                        </div>
                    </div>
                    <div className='entity-dialog-field'>
                        <div>
                            {t("administration.new")}:
                        </div>
                        <Button
                            variant="contained"
                            component="label"
                        >
                            {t("administration.upload_file")}
                            <input
                                type="file"
                                hidden
                            />
                        </Button>
                    </div>
                </div>
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.country")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'country', props.setCateringEstablishmentData
                        )
                    }
                    defaultValue={
                        props.catering_establishment ? props.catering_establishment[props.openedIndex].country : ''
                    }
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.city")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'city', props.setCateringEstablishmentData
                        )
                    }
                    defaultValue={
                        props.catering_establishment ? props.catering_establishment[props.openedIndex].city : ''
                    }
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.street")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'street', props.setCateringEstablishmentData
                        )
                    }
                    defaultValue={
                        props.catering_establishment ? props.catering_establishment[props.openedIndex].street : ''
                    }
                    required
                />
            </div>
        </div>
    )
}

export default CateringEstablishmentForm;