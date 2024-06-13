import React, {useEffect, useState} from 'react';

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

const getIngredientSelectionStyles = makeStyles((theme) => ({
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


const DishSearcher = (props) => {
    const [ingredients, setIngredients] = useState([]);
    const selectionStyles = getIngredientSelectionStyles();
    const theme = useTheme();
    const [ingredientName, setIngredientName] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [firstLoad, setFirstLoad] = useState(0);
    const { t } = useTranslation();

    const handleChange = (event) => {
        setIngredientName(event.target.value);
    };

    const getIngredients = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_INGREDIENTS;
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makeGetRequest(requestApi, headers, {})
            .then(response => setIngredients(response.data));
    }

    useEffect(() => {
        if (!firstLoad) {
            getIngredients();
            setFirstLoad(1);
        }
    })

    const getSearchDishesParams = () => {
        let params_string = '';
        for (let ingredient of ingredients) {
            if (ingredientName.includes(ingredient.name)) {
                params_string += '&0=' + ingredient.id;
            }
        }
        const maxMissedCount =
            document.getElementById('filled-number').value;
        params_string += '&1=' + maxMissedCount;

        return '?' + params_string.slice(1);
    }

    const getAppropriateDishes = () => {
        const requestParams = getSearchDishesParams();
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_APPROPRIATE_DISHES + requestParams;
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makeGetRequest(requestApi, headers, {})
            .then(response => {
                setDishes(response.data);
            });
    }

    return(
        <div align='left' className='page-content'>
            <div className='dish-searcher-navigation'>
                <FormControl
                    className={
                        [selectionStyles.formControl, 'dish-searcher-navigation-item']
                            .join(' ')}>
                    <InputLabel id="demo-mutiple-chip-label">
                        {t("dish_search.ingredients")}
                    </InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={ingredientName}
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
                        {ingredients.map((ingredient) => (
                            <MenuItem
                                key={ingredient.name}
                                value={ingredient.name}
                                style={getStyles(ingredient.name, ingredientName, theme)}>
                                {ingredient.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div className='dish-searcher-navigation-item'
                     id='missed-ingredients-input'>
                    <div>
                        {t("dish_search.absent_ingredients_num")}:
                    </div>
                    <TextField
                        id="filled-number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            inputProps: {
                                max: 10,
                                min: 0
                            }
                        }}
                        defaultValue='0'
                        variant="filled"
                    />
                </div>
                <Button variant="contained" color="primary"
                        onClick={getAppropriateDishes}
                        className='dish-searcher-navigation-item'>
                    {t("dish_search.find_dishes")}
                </Button>
            </div>
            <div id='dish-searcher-result'>
                {
                    dishes[0] && dishes[0].length > 0 &&
                    <div className='found-dishes-wrapper'>
                        <div id='appropriate-dishes-message'>
                            {t("dish_search.dishes_with_ingredients")}:
                        </div>
                        <div id='appropriate-dishes-container'
                             className='searcher-result-card-container'>
                            {
                                dishes[0] && dishes[0].map(dish =>
                                    <Card className='class-searcher-card'>
                                        <CardHeader
                                            title={dish.name}
                                            subheader={dish.type}
                                        />
                                        <CardContent>
                                            <img src={process.env.REACT_APP_API_URL +
                                            process.env.REACT_APP_IMAGES + dish.image} />
                                        </CardContent>
                                    </Card>
                                )
                            }
                        </div>
                    </div>
                }
                {
                    dishes[1] && dishes[1].length > 0 &&
                    <div className='found-dishes-wrapper'>
                        <div id='almost-appropriate-dishes-message'>
                            {t("dish_search.dishes_with_absent_ingredients")}:
                        </div>
                        <div id='almost-appropriate-dishes-container'
                             className='searcher-result-card-container'>
                            {
                                dishes[1] && dishes[1].map(dish =>
                                    <Card className='class-searcher-card'>
                                        <CardHeader
                                            title={dish.name}
                                            subheader={dish.type}
                                        />
                                        <CardContent>
                                            <img src={process.env.REACT_APP_API_URL +
                                            process.env.REACT_APP_IMAGES + dish.image} />
                                        </CardContent>
                                    </Card>
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default DishSearcher;
