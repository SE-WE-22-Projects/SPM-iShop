import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Button, FormControlLabel, MenuItem, Radio, RadioGroup, Stack, TextField } from '@mui/material';


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

export interface PromoData{
    name?: string;
    desc?: string;
    status?: boolean;
    dis_percentage?: number;
    dis_amount?: number;
    start_date?: any;
    end_date?: any;
    itemId?: number;
}

const AddPromotionModal = ({promoAddModalClose, open, addPromotion}:{promoAddModalClose: ()=>void, open: boolean, addPromotion: (promoData: PromoData)=>void}) => {
    const [promoData,setPromoData] = useState<PromoData>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPromoData((prevItemData) => ({
            ...prevItemData,
            [name]: value,
        }));
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={promoAddModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    Add new Promotion
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
                                    addPromotion(promoData);
                                    //itemAddModalClose();
                                }}
                            >
                                <Box>
                                    <TextField id="outlined-basic1" label="Promotion Name" variant="outlined" name="name" onChange={handleChange} />
                                </Box>
                                <Box>
                                    <TextField id="outlined-basic1" label="Promotion Description" variant="outlined" name="desc" onChange={handleChange} />
                                </Box>
                                <Box>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={true}
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio />} label="Inactive" />
                                </RadioGroup>
                                </Box>
                                <Box>
                                    <TextField type="number" id="outlined-basic2" label="Percentage" variant="outlined" name="dis_percentage" onChange={handleChange} />
                                </Box>
                                <Box>
                                    <TextField type="number" id="outlined-basic2" label="Amount" variant="outlined" name="dis_amount" onChange={handleChange} />
                                </Box>
                                <Box>
                                    <label htmlFor="startday">Start Date:</label>
                                    <input type="date" name='start_date' onChange={handleChange}/>
                                </Box>
                                <Box>
                                    <label htmlFor="endday">Start Date:</label>
                                    <input type="date" name='end_date' onChange={handleChange}/>
                                </Box>
                                <Box>
                                    <TextField
                                        id="outlined-select3"
                                        name="itemId"
                                        select
                                        label="Item ID"
                                        defaultValue={1}
                                        helperText="Please select rack ID"
                                        onChange={handleChange}
                                    >
                                        {/* TODO: need to add dynamic Item Ids */}
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
                                    <Button variant="outlined" color="error" onClick={promoAddModalClose} >Cancel</Button>
                                </Stack>
                            </Box>
                </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default AddPromotionModal;