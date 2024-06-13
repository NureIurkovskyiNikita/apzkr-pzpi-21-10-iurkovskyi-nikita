import TextField from "@material-ui/core/TextField";
import React from "react";
import {useTranslation} from "react-i18next";


const IngredientForm = (props) => {
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
                            event, props.newData, 'name', props.setIngredientData
                        )
                    }
                    defaultValue={
                        props.ingredients ? props.ingredients[props.openedIndex].name : ''
                    }
                    required
                />
            </div>
            <div className='entity-dialog-field entity-dialog-item'>
                <div>
                    {t("administration.price")}:
                </div>
                <TextField
                    className='entity-dialog-input'
                    onChange={event =>
                        props.handleData(
                            event, props.newData, 'price', props.setIngredientData
                        )
                    }
                    defaultValue={
                        props.ingredients ? props.ingredients[props.openedIndex].price : ''
                    }
                    required
                />
            </div>
        </div>
    )
}

export default IngredientForm;