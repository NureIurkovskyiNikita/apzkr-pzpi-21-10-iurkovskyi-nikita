import React, {useEffect, useState} from "react";

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {useTranslation} from "react-i18next";

const getDishSelectionStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: 350,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, ingredientName, theme) {
    return {
        fontWeight:
            ingredientName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const CateringEstablishmentSearcher = (props) => {
    const [dishes, setDishes] = useState([]);
    const [catering_establishment, setCatering_establishment] = useState([]);
    const selectionStyles = getDishSelectionStyles();
    const [firstLoad, setFirstLoad] = useState(0);
    const [dishName, setDishName] = useState([]);
    const theme = useTheme();
    const { t } = useTranslation();

    const handleChange = (event) => {
        setDishName(event.target.value);
    };

    const getDishes = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_DISHES;
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makeGetRequest(requestApi, headers, {})
            .then(response => setDishes(response.data));
    }

    const getSearchCateringEstablishmentParams = () => {
        let params_string = '';
        for (let dish of dishes) {
            if (dishName.includes(dish.name)) {
                params_string += '&dish=' + dish.id;
            }
        }

        if (params_string) {
            return '?' + params_string.slice(1);
        } else {
            return params_string;
        }
    }

    const getAppropriateCatering = () => {
        const requestParams = getSearchCateringEstablishmentParams();
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_APPROPRIATE_CATERING_ESTABLISHMENTS + requestParams;
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makeGetRequest(requestApi, headers, {})
            .then(response => {
                console.log(response.data);
                setCatering_establishment(response.data);
            });
    }

    useEffect(() => {
        if (!firstLoad) {
            getDishes();
            setFirstLoad(1);
        }
    })

    return (
        <div align='left' className='page-content'>
            <div className='dish-searcher-navigation'>
                <FormControl className={selectionStyles.formControl}>
                    <InputLabel id="demo-mutiple-chip-label">
                        {t("catering_establishment_search.dishes")}
                    </InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={dishName}
                        onChange={handleChange}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                            <div className={selectionStyles.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={selectionStyles.chip} />
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {dishes.map((dish) => (
                            <MenuItem
                                key={dish.name}
                                value={dish.name}
                                style={getStyles(dish.name, dishName, theme)}>
                                {dish.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={getAppropriateCatering}>
                    {t("catering_establishment_search.find_catering_establishments")}
                </Button>
            </div>
            {
                catering_establishment.length > 0 &&
                    <div className='found-dishes-wrapper'>
                        <div id='found-catering-establishments-message'>
                            {t("catering_establishment_search.found_catering_establishments")}:
                        </div>
                        <div id='appropriate-dishes-container' className='searcher-result-card-container'>
                            {
                                catering_establishment.map(establishment =>
                                    <Card className='class-searcher-card'>
                                        <CardHeader
                                            title={establishment.name}
                                            subheader={
                                                [establishment.country, establishment.city, establishment.street].join(', ')
                                            }
                                        />
                                        <CardContent>
                                            <img src={establishment.image} />
                                        </CardContent>
                                    </Card>
                                )
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default CateringEstablishmentSearcher;