const entitiesData = {
    'dish': {
        'headers': [
            {id: 'id', numeric: false, disablePadding: true, label: 'Id'},
            {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
            {id: 'description', numeric: true, disablePadding: false, label: 'Description'},
            {id: 'type', numeric: true, disablePadding: false, label: 'Type'},
            {id: 'popularity', numeric: true, disablePadding: false, label: 'Popularity'},
            {id: 'rate', numeric: true, disablePadding: false, label: 'Rate'},
        ],
        'link': process.env.REACT_APP_DISHES
    },
    'ingredient': {
        'headers': [
            {id: 'id', numeric: false, disablePadding: true, label: 'Id'},
            {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
            {id: 'price', numeric: true, disablePadding: false, label: 'Price'},
        ],
        'link': process.env.REACT_APP_INGREDIENTS
    },
    'cateringEstablishment': {
        'headers': [
            {id: 'id', numeric: false, disablePadding: true, label: 'Id'},
            {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
            {id: 'establishment_code', numeric: true, disablePadding: false, label: 'Establishment code'},
            {id: 'country', numeric: true, disablePadding: false, label: 'Country'},
            {id: 'city', numeric: true, disablePadding: false, label: 'City'},
            {id: 'street', numeric: true, disablePadding: false, label: 'Street'},
        ],
        'link': process.env.REACT_APP_CATERING_ESTABLISHMENT
    },
    'automaticMachineType': {
        'headers': [
            {id: 'id', numeric: false, disablePadding: true, label: 'Id'},
        ],
        'link': process.env.REACT_APP_AUTOMATIC_MACHINE_TYPE
    },
    'user': {
        'headers': [
            {id: 'id', numeric: false, disablePadding: true, label: 'Id'},
            {id: 'username', numeric: false, disablePadding: true, label: 'Username'},
            {id: 'password', numeric: false, disablePadding: true, label: 'Password'},
            {id: 'is_VIP', numeric: false, disablePadding: true, label: 'Is VIP'},
        ],
        'link': process.env.REACT_APP_USER
    }
};

export default entitiesData;