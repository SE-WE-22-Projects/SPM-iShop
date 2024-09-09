import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ItemTable from './ItemTable';
import { itemDataTable } from '../../inventory/itemComponents/ItemTable';
import { Box, Modal, Typography } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    
  };

const ItemTableModal = ({open, handleClose, data, setSelectedRow}:{open: boolean, handleClose :()=>void, data:itemDataTable[], setSelectedRow: (data:itemDataTable)=>void })=>{
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Modal title
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <Box id="modal-modal-description" sx={{ mt: 2 }}>
                    <ItemTable data={data} setSelectedRow={setSelectedRow} handleClose={handleClose} />
                </Box>
            </Box>
        </Modal>
    );
}

export default ItemTableModal;