import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Chip from '@material-ui/core/Chip';
import Rating from '@material-ui/lab/Rating';
import {NavLink} from "react-router-dom";
import i18n from "i18next";
import {useTranslation} from "react-i18next";

const getFilterStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

const getSearchFieldStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 320,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
}));

const getDishCardStyle = makeStyles((theme) => ({
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));

const Catalog = (props) => {
    const filterStyles = getFilterStyles();
    const searchFieldStyles = getSearchFieldStyles();
    const [dishesList, setDishesList] = useState([]);
    const [types, setTypes] = useState([]);
    const [popularityVariants, setPopularityVariants] = useState([]);
    const [firstLoad, setFirstLoad] = useState(0);
    const [sliderRange, setSliderRange] = useState([1, 5]);
    const [anchorEl, setAnchorEl] = useState(null);
    const { t } = useTranslation();
    const [sortOrder, setSortOrder] = useState(0);
    const open = Boolean(anchorEl);
    const [reorderingIsNeeded, setReorderingNeedness] = useState(false);
    const dishCardStyle = getDishCardStyle();
    const searchRef = useRef('');
    const catalogComparator = new CatalogComparator();
    const sortOrders = [
        t("catalog.sort_by_name"),
        t("catalog.sort_by_rate_ascending"),
        t("catalog.sort_by_rate_descending")
    ]

    const handleSortMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = (event) => {
        setAnchorEl(null);
    };

    const getFilteringData = async () => {
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_CATALOG_FILTERS;
        return props.requestManager.makeGetRequest(requestApi, {}, {});
    }

    useEffect( () => {
        if (!firstLoad) {
            getFilteringData()
                .then(res => {
                    setTypes(res.data['type']);
                    setPopularityVariants(res.data['popularity']);
                })
                .catch(
                    error => {
                        let a = error.message;
                    }
                )
            getCatalogData();
        }
        setFirstLoad(1);
    }, );

    useEffect(() => {
        if (reorderingIsNeeded) {
            reorderCatalog();
        }
    }, );

    const sliderChangeValue = (event, newValue) => {
        setSliderRange(newValue);
    };

    const setDropdownItem = (event) => {
        setSortOrder(event.target.text);
    }

    const getFilterQueryParameters = (isSearching) => {
        let params_string = '';
        for (let type of types) {
            if (document.getElementById('type_' + type).checked) {
                params_string += '&0=' + type;
            }
        }
        for (let popularity of popularityVariants) {
            if (document.getElementById('popularity_' + popularity).checked) {
                params_string += '&1=' + popularity;
            }
        }
        const min_rate = sliderRange[0];
        params_string += '&2=' + min_rate;
        const max_rate = sliderRange[1];
        params_string += '&3=' + max_rate;
        if (isSearching === true) {
            const searchText =
                document.getElementById('catalog-search-field').value;
            params_string += '&4=' + searchText;
        }
        if (params_string.length) {
            return params_string.slice(1);
        }
        return params_string;
    }

    const getCatalogData = (isSearch) => {
        const params = getFilterQueryParameters(isSearch);
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_FILTERED_DISHES + '?' + params;
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makeGetRequest(requestApi, headers, {})
            .then(response => {
                setDishesList(response.data);
                setReorderingNeedness(true);
            });
    }

    const reorderCatalog = () => {
        switch(sortOrder) {
            case 0:
                dishesList.sort(catalogComparator.nameComparator);
                break;
            case 1:
                dishesList.sort(catalogComparator.rateAscendingComparator);
                break;
            case 2:
                dishesList.sort(catalogComparator.rateDescendingComparator);
                break;
        }
        setDishesList(dishesList);
        setReorderingNeedness(false);
    }

    return (
        <div align='left' className='page-content'>
            <div id='catalog-wrapper'>
                <div id='filtering-wrapper'>
                    <div className={filterStyles.root}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={filterStyles.heading}>
                                    {t("catalog.dish_types_filter")}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup column>
                                    {
                                        types.map(
                                            item =>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            id={'type_' + item}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={item}
                                                />
                                        )
                                    }
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <Typography className={filterStyles.heading}>
                                    {t("catalog.popularity_filter")}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup column>
                                    {
                                        popularityVariants.map(
                                            item =>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            id={'popularity_' + item}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={item}
                                                />
                                        )
                                    }
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                            >
                                <Typography className={filterStyles.heading}>
                                    {t("catalog.rate_filter")}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup column>
                                    <Slider
                                        id='filter-slider'
                                        min={1}
                                        step={1}
                                        max={5}
                                        value={sliderRange}
                                        onChange={sliderChangeValue}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="range-slider"
                                    />
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <div className='centrator'>
                            <Button variant="contained" color="primary" onClick={getCatalogData}>
                                {t("catalog.apply_filters")}
                            </Button>
                        </div>
                    </div>
                </div>
                <div id='catalog-content-wrapper'>
                    <div id='catalog-manager'>
                        <Paper component="form" className={searchFieldStyles.root}>
                            <InputBase
                                id='catalog-search-field'
                                className={searchFieldStyles.input}
                                ref={searchRef}
                                placeholder={t("catalog.catalog_search_placeholder")}
                            />
                            <IconButton
                                className={searchFieldStyles.iconButton}
                                aria-label="search"
                                onClick={_ => {
                                    getCatalogData(true);
                                }}
                                >
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                        <div>
                            <Button variant="contained" color="secondary" aria-controls="fade-menu"
                                    aria-haspopup="true" id='catalog-search' onClick={handleSortMenuClick}>
                                {sortOrders[sortOrder]}
                            </Button>
                            <Menu
                                id="fade-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={open}
                                onClose={handleSortMenuClose}
                                TransitionComponent={Fade}
                            >
                                <MenuItem onClick={() => {
                                    setSortOrder(0);
                                    setReorderingNeedness(true);
                                    handleSortMenuClose();
                                }}>
                                    {sortOrders[0]}
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    setSortOrder(1);
                                    setReorderingNeedness(true);
                                    handleSortMenuClose();
                                }}>
                                    {sortOrders[1]}
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    setSortOrder(2);
                                    setReorderingNeedness(true);
                                    handleSortMenuClose();
                                }}>
                                    {sortOrders[2]}
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div id='catalog-dishes-container'>
                        {dishesList.map(dish =>
                            <NavLink to={'/catalog/' + dish.id}
                                     className='dish-link-from-catalog'>
                                <Card className={[getDishCardStyle.root, 'catalog-card'].join(' ')}>
                                    <CardHeader
                                        action={
                                            <div className='catalog-card-action'>
                                                <Rating
                                                    name="read-only"
                                                    value={dish.rate}
                                                    readOnly
                                                />
                                                <div>
                                                    {
                                                        dish.popularity && <Chip
                                                            label={dish.popularity} color='primary' />
                                                    }
                                                </div>
                                            </div>
                                        }
                                        title={dish.name}
                                        subheader={dish.type}
                                    />
                                    <CardContent>
                                        <img src={dish.image} />
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {dish.description.slice(0, 366)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export class CatalogComparator {
    rateAscendingComparator = (object1, object2) => {
        return object1.rate - object2.rate;
    }

    rateDescendingComparator = (object1, object2) => {
        return object2.rate - object1.rate;
    }

    nameComparator = (object1, object2) => {
        const name1 = object1.name;
        const name2 = object2.name;
        if (name1 > name2) {
            return 1;
        } else if (name1 === name2) {
            return 0;
        }
        return -1;
    }
}

export default Catalog;