import React, {useEffect, useState} from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AutomaticMachineTypeTableRows from "./AutomaticMachineTypeTableRows";
import CateringEstablishmentTableRows from "./CateringEstablishmentTableRows";
import DishForm from "./DishForm";
import DishTableRows from "./DishTableRows";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import entitiesData from "./EntitiesData";
import IngredientTableRows from "./IngredientTableRows";
import OperationNotificator from "./OperationNotificator";
import UserTableRows from "./UserTableRows";
import IngredientForm from "./IngredientForm";
import CateringEstablishmentForm from "./CateringEstablishmentForm";
import UserForm from "./UserForm";
import {useTranslation} from "react-i18next";


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: '100%',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

const getRows = (object) => {
    return Object.values(object);
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const useStyles1 = makeStyles((theme) => ({
    root: {
        // width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        // minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

const AdministrationPage = (props) => {
    const [currentTable, setCurrentTable] = useState('dish');
    const [entities, setEntities] = useState([]);
    const [newEntityData, setNewEntityData] = useState({});
    const [openedEntityIndex, setOpenedEntityIndex] = React.useState(0);
    const [entityRows, setEntityRows] = React.useState([]);
    const { t } = useTranslation();

    const [firstLoad, setFirstLoad] = useState(0);
    const [notification, setNotification] = useState({
        status: false,
        message: ''
    });

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const classes1 = useStyles1();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');

    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [openingReason, setOpeningReason] = React.useState(false);

    const tableTabs = [
        t("administration.dish"),
        t("administration.ingredient"),
        t("administration.catering_establishment"),
        t("administration.automatic_machine_type"),
        t("administration.user")
    ];

    const getEntityIndex = (selectedRowIndex) => {
        let searchedId = entities[selectedRowIndex]['id'];
        let res = 0;
        // for (let i = 0; i < entities.length; ++i) {
        //     if (entities[i]['id'] == )
        // }
        return res;
    }

    const idComparator = (object1, object2) => {
        return object1.id - object2.id;
    }

    const handleClickOpen = (index) => () => {
        setOpeningReason('edit');
        setOpen(true);
        setOpenedEntityIndex(index);
    };

    const handleClose = (reason) => {
        setOpen(false);
        if (reason === 'Ok') {
            const updatedEntities = entities;
            if (openingReason === 'edit') {
                for (const [key, value] of Object.entries(newEntityData)) {
                    updatedEntities[openedEntityIndex][key] = value;
                }
                updatedEntities.sort(idComparator);
                setEntities(updatedEntities);
                pullNewEntityData();
            } else {
                postNewEntityData();
            }
        }
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = entityRows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleChange = (event, newValue) => {
        setEntities([]);
        setValue(newValue);
        setCurrentTable(Object.keys(entitiesData)[newValue]);
    };

    const getEntities = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            entitiesData[currentTable]['link'];
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makeGetRequest(requestApi, headers, {})
            .then(response => {
                const newData = response.data;
                newData.sort(idComparator);
                setEntities(newData);
            });
    }

    useEffect(() => {
        getEntities();
    }, [currentTable])

    useEffect(() => {
        setEntityRows(getRows(entities));
    }, [entities])

    const pullNewEntityData = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            entitiesData[currentTable]['link'] + entities[openedEntityIndex].id + '/';
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makePatchRequest(requestApi, headers, newEntityData);
        setNewEntityData({});
    }

    const postNewEntityData = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            entitiesData[currentTable]['link'];
        const headers = props.requestManager.getAuthHeader();

        props.requestManager.makePostRequest(requestApi, headers, newEntityData)
            .catch(err => {
                console.log(err);
            });
        setNewEntityData({});
        setTimeout(getEntities, 50);
    }

    const handleNewData = (event, newDataObject, field, setFunction) => {
        const updatedData = newDataObject;
        let newValue = event.target.value;
        if (/^\d+$/g.test(newValue)) {
            newValue = parseInt(newValue);
        } else if (/^\d+.\d+$/g.test(newValue)) {
            newValue = parseFloat(newValue);
        }
        updatedData[field] = newValue;
        setFunction(updatedData);
    }

    const deleteEntitiesWithId = (ids) => {
        const headers = props.requestManager.getAuthHeader();

        for (let id of ids) {
            let requestApi = process.env.REACT_APP_API_URL +
                entitiesData[currentTable]['link'] + id + '/';
            props.requestManager.makeDeleteRequest(requestApi, headers);
        }
    }

    const deleteSelectedEntities = () => {
        const newDishState = entities;
        const deletingIds = [];
        for (let i = 0; i < entities.length; ++i) {
            if (selected.includes(entities[i].id)) {
                deletingIds.push(entities[i].id);
                newDishState.splice(i, 1);
                --i;
            }
        }

        deleteEntitiesWithId(deletingIds);
        newDishState.sort(idComparator);
        setEntities(newDishState);
        setEntityRows(getRows(entities));
        setSelected([]);
    }

    const makeBackup = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_BACKUP;

        props.requestManager.makePostRequest(requestApi, {}, {})
            .then(setNotification({
                status: true,
                message: t("administration.backup_success"),
            }))
            .catch(e => {
                console.log(12);
            })
        ;
    }

    const restoreDatabase = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_RESTORE_DB;

        props.requestManager.makePostRequest(requestApi, {}, {})
            .then(setNotification({
                status: true,
                message: t("administration.restore_success"),
            }));
    }

    const updateCertificates = () => {
        const requestApi = process.env.REACT_APP_API_URL +
            process.env.REACT_APP_UPDATE_CERTIFICATE;

        props.requestManager.makePostRequest(requestApi, {}, {})
            .then(setNotification({
                status: true,
                message: t("administration.cert_update_success"),
            }));
    }

    return(
        <div align='left' className='page-content'>
            <div id='admin-control-buttons'>
                <Button variant="contained" color="primary" onClick={makeBackup}>
                    {t("administration.create_backup")}
                </Button>
                <Button variant="contained" color="primary" onClick={restoreDatabase}>
                    {t("administration.restore_db")}
                </Button>
                <Button variant="contained" color="primary" onClick={updateCertificates}>
                    {t("administration.update_certificate")}
                </Button>
            </div>
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label={tableTabs[0]} {...a11yProps(0)} />
                    <Tab label={tableTabs[1]} {...a11yProps(1)} />
                    <Tab label={tableTabs[2]} {...a11yProps(2)} />
                    <Tab label={tableTabs[3]} {...a11yProps(3)} />
                    <Tab label={tableTabs[4]} {...a11yProps(4)} />
                </Tabs>
                <div className={classes1.root}>
                    <Paper className={classes1.paper}>
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            deleteFunction={deleteSelectedEntities}
                            setOpeningReason={setOpeningReason}
                            setOpen={setOpen}
                            tableName={tableTabs[value]} />
                        <TableContainer>
                            <Table
                                className={classes1.table}
                                aria-labelledby="tableTitle"
                                size='medium'
                                aria-label="enhanced table"
                            >
                                <EnhancedTableHead
                                    classes={classes1}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={entityRows.length}
                                    tableName={currentTable}
                                />
                                <TableBody>
                                    {stableSort(entityRows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                (entities.length === 0)
                                                    ? <div></div>
                                                    : currentTable === 'dish'
                                                    ? <DishTableRows
                                                        isItemSelected={isItemSelected}
                                                        row={row}
                                                        index={index}
                                                        labelId={labelId}
                                                        handleClick={handleClick}
                                                        handleClickOpen={handleClickOpen} />
                                                    : currentTable === 'ingredient'
                                                    ? <IngredientTableRows
                                                        isItemSelected={isItemSelected}
                                                        row={row}
                                                        index={index}
                                                        labelId={labelId}
                                                        handleClick={handleClick}
                                                        handleClickOpen={handleClickOpen} />
                                                    : currentTable === 'cateringEstablishment'
                                                    ? <CateringEstablishmentTableRows
                                                        isItemSelected={isItemSelected}
                                                        row={row}
                                                        index={index}
                                                        labelId={labelId}
                                                        handleClick={handleClick}
                                                        handleClickOpen={handleClickOpen} />
                                                    : currentTable === 'automaticMachineType'
                                                    ? <AutomaticMachineTypeTableRows
                                                        isItemSelected={isItemSelected}
                                                        row={row}
                                                        index={index}
                                                        labelId={labelId}
                                                        handleClick={handleClick}
                                                        handleClickOpen={handleClickOpen} />
                                                    : currentTable === 'user'
                                                    ? <UserTableRows
                                                        isItemSelected={isItemSelected}
                                                        row={row}
                                                        index={index}
                                                        labelId={labelId}
                                                        handleClick={handleClick}
                                                        handleClickOpen={handleClickOpen} />
                                                    : <div></div>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={entityRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            </div>

            {
                open &&
                <Dialog
                    open={open}
                    onClose={handleClose}
                    scroll='paper'
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    fullWidth='500px'
                >
                    <DialogTitle id="scroll-dialog-title">
                        {tableTabs[value]}: {openingReason === 'edit'
                        ? t("administration.adding") : t("administration.editing")}
                    </DialogTitle>
                    <DialogContent dividers={true}>
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            {
                                currentTable === 'dish'
                                ? <DishForm
                                      setDishData={setNewEntityData}
                                      handleData={handleNewData}
                                      newData={newEntityData}
                                      dishes={openingReason === 'edit' ? entities : 0}
                                      openedIndex={openedEntityIndex} />
                                : currentTable === 'ingredient'
                                ? <IngredientForm
                                      setIngredientData={setNewEntityData}
                                      handleData={handleNewData}
                                      newData={newEntityData}
                                      ingredients={openingReason === 'edit' ? entities : 0}
                                      openedIndex={openedEntityIndex} />
                                : currentTable === 'cateringEstablishment'
                                ? <CateringEstablishmentForm
                                      setCateringEstablishmentData={setNewEntityData}
                                      handleData={handleNewData}
                                      newData={newEntityData}
                                      catering_establishment={openingReason === 'edit' ? entities : 0}
                                      openedIndex={openedEntityIndex} />
                                : <UserForm
                                      setUserData={setNewEntityData}
                                      handleData={handleNewData}
                                      newData={newEntityData}
                                      users={openingReason === 'edit' ? entities : 0}
                                      openedIndex={openedEntityIndex} />
                            }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            {t("administration.cancel")}
                        </Button>
                        <Button onClick={_ => handleClose('Ok')} color="primary">
                            {t("administration.apply")}
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            <OperationNotificator
                open={notification.status}
                closeNotificationBar={() => setNotification({
                    status: false,
                    message: '',
                })}
                message={notification.message}/>
        </div>
    )
}

export default AdministrationPage;