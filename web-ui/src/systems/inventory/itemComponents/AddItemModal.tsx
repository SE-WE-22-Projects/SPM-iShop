import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  
};

export interface itemData{
    name?: string;
    desc?: string;
    price?: number;
    qty?: number;
    rackId?: number;
}

const AddItemModal=({ itemAddModalClose, open, addItem}:{ itemAddModalClose: ()=>void, open: boolean, addItem: (itemData: itemData)=> void}) => {
    const [itemData,setItemData] = useState<itemData>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setItemData((prevItemData) => ({
        ...prevItemData,
        [name]: value,
    }));
    }

  return (
    <div>
      <Modal
        open={open}
        onClose={itemAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add new Item
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
          <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 3, width: '25ch' },
                        }}
                        autoComplete="off"
                        onSubmit={(e) => {
                            e.preventDefault();
                            addItem(itemData);
                            //itemAddModalClose();
                        }}
                    >
                        <Box>
                            <TextField id="outlined-basic1" label="Item Name" variant="outlined" name="name" onChange={handleChange} />
                        </Box>
                        <Box>
                            <TextField id="outlined-basic1" label="Item Description" variant="outlined" name="desc" onChange={handleChange} />
                        </Box>
                        <Box>
                            <TextField type="number" id="outlined-basic2" label="Unit Price" variant="outlined" name="price" onChange={handleChange} />
                        </Box>
                        <Box>
                            <TextField type="number" id="outlined-basic2" label="Quantity" variant="outlined" name="qty" onChange={handleChange} />
                        </Box>
                        <Box>
                            <TextField
                                id="outlined-select3"
                                name="rackId"
                                select
                                label="Rack ID"
                                defaultValue={1}
                                helperText="Please select rack ID"
                                onChange={handleChange}
                            >
                                <MenuItem value={1}>
                                    1
                                </MenuItem>
                                <MenuItem value={2}>
                                    2
                                </MenuItem>
                                <MenuItem value={3}>
                                    3
                                </MenuItem>
                                <MenuItem value={4}>
                                    4
                                </MenuItem>
                                <MenuItem value={5}>
                                    5
                                </MenuItem>
                            </TextField>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button variant="outlined" color="success" type='submit'>Create</Button>
                            <Button variant="outlined" color="error" onClick={itemAddModalClose} >Cancel</Button>
                        </Stack>
                    </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default AddItemModal