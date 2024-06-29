import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import React from "react";

const IngredientTableRows = (props) => {
    return(
        <TableRow
            hover
            role="checkbox"
            aria-checked={props.isItemSelected}
            tabIndex={-1}
            key={props.row.id}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    onClick={(event) =>
                        props.handleClick(event, props.row.id)}
                    checked={props.isItemSelected}
                    inputProps={{ 'aria-labelledby': props.labelId }}
                />
            </TableCell>
            <TableCell
                align="right"
                onClick={props.handleClickOpen(props.index)}>
                {props.row.id}
            </TableCell>
            <TableCell
                component="th"
                id={props.labelId}
                scope="row"
                padding="none"
                onClick={props.handleClickOpen(props.index)}>
                {props.row.name}
            </TableCell>
            <TableCell
                align="right"
                onClick={props.handleClickOpen(props.index)}>
                {props.row.price}
            </TableCell>
        </TableRow>
    )
}

export default IngredientTableRows;