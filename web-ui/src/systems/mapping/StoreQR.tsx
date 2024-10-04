import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import PageLoader from '../../common/PageLoader';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';


const StoreQR = () => {
    const [qrData,setQrData] = useState<string>("");

    const getQRData = async ()=>{
        const res = await axios.get('api/mapping/ip');
        setQrData(res.data.qr);
    }

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [isLoading,setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        getQRData();
        setTimeout(() => setIsLoading(false), 1000);
    }, []);
    
    return (
        <div>
            {
                isLoading ? <PageLoader /> :
                    <div>
                        <Typography variant="h3" align="center"> Store QR Code</Typography>
                        <Box justifyContent="center" display="flex">
                            <img src={qrData} />
                        </Box>
                    </div>
            }
        </div>
    )
}

export default StoreQR