import React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

import ArtEntryDialog from './ArtEntryDialog';
import DialogButton from './DialogButton';
import Sortable from './Sortable';

const useStyles = makeStyles((theme) => ({    
    galleryDiv: {
        position: 'relative',
        height: '90vh',
        width: '90%',
        background: 'transparent',
        display: 'table',
        margin: '0 auto'
    },
    img: {
        position: 'absolute',
        top: 0,
        left: 0,
        heigth: "100%",
        width: "100%"
    },
    checkbox: {
        padding: 2
    }
}));

export default function Users(props) { 
    const classes = useStyles();
    const [openDialog, setOpenDialog] = React.useState("");
    const [artEntry, setArtEntry] = React.useState("")
    const [user, setUser] = React.useState(false);
    const [newuser, setNewUser] = React.useState("");
    const [emailOk, setEmailOk] = React.useState(false);
    const [sendResetEMail, setSendResetEMail] = React.useState(false);

    const handleOpenEntryOf = (uid) => {
        setOpenDialog("ArtEntry");
        setArtEntry(uid);
    };

    const handleOpenCreateUser = () => {
        setOpenDialog("CreateUser");
    };

    const handleCloseDialog = () => {
        setOpenDialog("");
    };

    const handleSetClaim = (uid, claim, value) => {
        props.setClaim(uid, claim, value);
    };

    const handleOpenDeleteUser = (user) => {
        setUser(user);
        setOpenDialog("DeleteUser");
    }

    const handleDeleteUser = (uid) => {
        props.deleteUser(uid).then(() => {
            setOpenDialog("");
        });
    }

    const handleCreateUser = (uid) => {
        if (newuser !== "" && emailOk) {
            props.createUser(uid).then((user) => {
                setOpenDialog("")
            });
        }
    }

    const handleNewUserChange = (e) => {
        setNewUser(e.target.value);
        setEmailOk(validateEmail(e.target.value));
    }

    const handleSetSendResetEMail = (e) => {
        setSendResetEMail(e.target.checked);
    }

    const validateEmail = (email) => {
        const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/;
        return re.test(String(email).toUpperCase());

    }

    const renderPlus = () => {
        return (
            <Button onClick={handleOpenCreateUser}>
                <AddCircleTwoToneIcon />
            </Button>
        )
    }

    const renderArtEntry = (cell, index, cellConfig, row, rowIndex, rowConfig) => {
        return (
            <Link onClick={() => { handleOpenEntryOf(row) }}>{cell}
            </Link>
        );
    }

    const renderRegistered = (cell, index, cellConfig, row, rowIndex, rowConfig) => {
        return (
            <Checkbox checked={cell} className={classes.checkbox}
                onChange={e => { handleSetClaim(row.uid, 'reg', e.target.checked) }}
                name="registered" inputProps={{ 'aria-label': 'Registered' }} />
        );
    }
    const renderAdmin = (cell, index, cellConfig, row, rowIndex, rowConfig) => {
        return (
            <Checkbox checked={cell} className={classes.checkbox}
                onChange={e => { handleSetClaim(row.uid, 'adm', e.target.checked) }}
                name="admin" inputProps={{ 'aria-label': 'Admin' }} />
        );
    }
    const renderTOS = (cell, index, cellConfig, row, rowIndex, rowConfig) => {
        if (true) {
            return cell ? "Yes" : "No";
        } else {
            return (
                <Checkbox checked={cell} className={classes.checkbox}
                    onChange={e => { handleSetClaim(row.uid, 'tos', e.target.checked) }}
                    name="tos" inputProps={{ 'aria-label': 'TOS' }} />
            );
        }
    }

    const renderDelete = (cell, index, cellConfig, row, rowConfig) => {
        return (
            <Button onClick={e => { handleOpenDeleteUser(row) }} >
                <DeleteIcon />
            </Button>
        );
    }

    const tableConfig = [
    { id: 'email',        label: 'EMail',      sort: true, cellRender: renderArtEntry},
    { id: 'registered',   label: 'Registered', sort: true, cellRender: renderRegistered},
    { id: 'admin',        label: 'Admin',      sort: true, cellRender: renderAdmin},
    { id: 'tos',          label: 'TOS',        sort: true, cellRender: renderTOS},
    { id: 'delete',       label: '',                       cellRender: renderDelete, headRender: renderPlus},
    ];

    const users = props.users;

    return (
        <div className={classes.galleryDiv}>
          <Sortable config={tableConfig} rows={users} rowKey={row => row.uid} stickyHeader padding="none"/>

          <ArtEntryDialog open={openDialog === "ArtEntry"} onClose={handleCloseDialog} 
            title={artEntry.email} uid={artEntry.uid} />

          <Dialog   open={openDialog === "DeleteUser"} maxWidth="md" 
                    onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Delete User - {user.email}
            </DialogTitle>
            <DialogContent>
                Are you sure you want to delete <b>{user.email}</b>?
            </DialogContent>
            <DialogActions>
                <DialogButton onClick={handleCloseDialog}>Cancel</DialogButton>
                <DialogButton onClick={e => { handleDeleteUser(user.uid)}}>Delete</DialogButton>
            </DialogActions>
          </Dialog>

          <Dialog   open={openDialog === "CreateUser"} maxWidth="md" 
                    onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create User</DialogTitle>
            <DialogContent>
                <TextField className={classes.textField}
                    onChange={handleNewUserChange} 
                    label="newuser"
                    margin="dense"
                    type="text"
                    error={!emailOk}
                    value={newuser}
                />
                <FormControlLabel label="Send Reset EMail"
                    control={
                <Checkbox   checked={sendResetEMail} 
                            onChange={handleSetSendResetEMail} 
                            name="sendReset" inputProps={{ 'aria-label': 'Send Reset EMail' }} />
                    }
                />
            </DialogContent>
            <DialogActions>
                <DialogButton onClick={handleCloseDialog}>Cancel</DialogButton>
                <DialogButton onClick={e => { handleCreateUser(newuser)}} >Create</DialogButton>
            </DialogActions>
          </Dialog>
        </div>
    );
}