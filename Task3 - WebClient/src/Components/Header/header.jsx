// import { Component } from 'react';
// import { Navbar, Nav } from 'react-bootstrap';
// import {NavLink} from "react-router-dom";
// import { Button } from 'react-bootstrap';
// import logo from '../../images/header/logo.png';

import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LanguageIcon from '@material-ui/icons/Language';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ShopTwoIcon from '@material-ui/icons/ShopTwo';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import StoreIcon from '@material-ui/icons/Store';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import {NavLink} from "react-router-dom";
import { orange, green, blue, purple, cyan, blueGrey, red, lightGreen } from '@material-ui/core/colors';
import i18n from "i18next";
import {useTranslation} from "react-i18next";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));


const Header = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation();
    const mainMenu = [
        t("main_menu.catalog"),
        t("main_menu.dish_search"),
        t("main_menu.catering_establishment_search"),
    ]
    const mainMenuPath = [
        '/catalog',
        '/dish_searcher',
        '/catering_establishment_searcher'
    ]
    const menuMenuIcons = [
        <ShopTwoIcon style={{ color: blue[500] }} />,
        <FastfoodIcon style={{ color: cyan[700] }}/>,
        <StoreIcon style={{ color: purple[700] }} />
    ]
    const authorizedAdditionalMenu = [
        t("main_menu.administration"),
        t("main_menu.log_out"),
    ]
    const authorizedAdditionalMenuPath = [
        '/admin',
        '/login'
    ]
    const authorizedAdditionalMenuIcons = [
        <SupervisorAccountIcon style={{ color: orange[800] }} />,
        <ExitToAppIcon style={{ color: red[700] }} />
    ]
    const unauthorizedAdditionalMenu = [
        t("main_menu.registration"),
        t("main_menu.log_in"),
    ]
    const unauthorizedAdditionalMenuIcons = [
        <PersonAddIcon style={{ color: orange[500] }} />,
        <PersonIcon style={{ color: green[700] }} />
    ]
    const unauthorizedAdditionalMenuPath = [
        '/register',
        '/login'
    ]
    const pathTitles = {
        'catalog': t("main_menu.catalog"),
        'dish_searcher': t("main_menu.dish_search"),
        'catering_establishment_searcher':
            t("main_menu.catering_establishment_search"),
        'admin': t("main_menu.administration"),
        'login': t("main_menu.log_in"),
        'register': t("main_menu.registration")
    }

    const getTitleByPath = () => {
        return pathTitles[window.location.pathname.split('/')[1]];
    }

    const [title, setTitle] = useState(
        getTitleByPath()
    );

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const menuId = 'primary-search-account-menu';

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={_ => {
                handleMenuClose();
                i18n.changeLanguage("ua");
                localStorage.setItem('fap-language', 'ua');
            }}>
                Українська
            </MenuItem>
            <MenuItem onClick={_ => {
                handleMenuClose();
                i18n.changeLanguage("en");
                localStorage.setItem('fap-language', 'en');
            }}>
                English
            </MenuItem>
        </Menu>
    );

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                color='primary'
                position='relative'
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                }) }
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className='header-menu'>
                        <Typography variant="h6" noWrap>
                            {getTitleByPath()}
                        </Typography>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <LanguageIcon />
                        </IconButton>
                    </div>
                </Toolbar>
                {renderMenu}
            </AppBar>

            <Drawer
                variant="permanent"
                color='primary'
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {
                            theme.direction === 'rtl'
                            ? <ChevronRightIcon />
                            : <ChevronLeftIcon />
                        }
                    </IconButton>
                </div>
                <Divider />
                {
                    props.authStatus &&
                    <List>
                        {mainMenu.map((text, index) => (
                            <NavLink to={mainMenuPath[index]}
                                     className='link-wrapper'>
                                <ListItem button key={text}
                                          >
                                    <ListItemIcon>
                                        {menuMenuIcons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            </NavLink>
                        ))}
                    </List>
                }
                <Divider />
                <List>
                    {(props.authStatus
                        ? authorizedAdditionalMenu
                        : unauthorizedAdditionalMenu)
                        .map((text, index) => (
                            <NavLink to={
                                (props.authStatus
                                ? authorizedAdditionalMenuPath
                                : unauthorizedAdditionalMenuPath)[index]
                            }
                                     className='link-wrapper'>
                                <ListItem button key={text}>
                                    <ListItemIcon
                                        onClick={() => {
                                            if (index === 1) {
                                                localStorage.setItem('fap_access', '');
                                                props.authStatusChanger(false);
                                            }
                                        }}>
                                        {(props.authStatus
                                            ? authorizedAdditionalMenuIcons
                                            : unauthorizedAdditionalMenuIcons)[index]
                                        }
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            </NavLink>
                    ))}
                </List>
            </Drawer>
        </div>
    )
}

export default Header;