import { Print } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import generatePDF, { Margin } from "react-to-pdf";

const ReportGenerator = ({ children, filename, title, visible, titleHidden, buttonRef }: { children: ReactElement | ReactElement[], visible?: boolean, titleHidden?: boolean, filename: string, title: string, buttonRef?: MutableRefObject<HTMLElement> }) => {
    const [isPrint, setIsPrinting] = useState(false);

    useEffect(() => {
        if (isPrint) {
            generatePDF(ref, { filename: filename, page: { margin: Margin.SMALL } })
            setIsPrinting(false);
        }
    }, [isPrint]);

    // handle custom buttons
    useEffect(() => {
        if (!buttonRef || !buttonRef.current) return;

        const elem = buttonRef.current;
        const handler = () => setIsPrinting(true);
        elem.addEventListener("click", handler);

        return () => elem.removeEventListener("click", handler);

    })

    const ref = useRef<any>();
    return <>
        {buttonRef ? null : <Button onClick={() => setIsPrinting(true)} startIcon={<Print />}>Download</Button>}
        {isPrint || visible ? <div ref={ref} style={{ padding: "4em 2em" }}>
            {isPrint || !titleHidden ? <Typography textAlign="center" variant="h6">{title}</Typography> : null}
            {children}
        </div> : null}
    </>
};


export default ReportGenerator;