import { useContext } from "react";
// import Alert from 'react-bootstrap/Alert';
import { Alert, IconButton } from "@mui/material";
// import Collapse from 'react-bootstrap/Collapse';
import { Collapse } from "@mui/material";
import { FlashContext } from "../contexts/FlashProvider";
import CloseIcon from '@mui/icons-material/Close';

export default function FlashMessage() {
    const { flashMessage, visible, hideFlash } = useContext(FlashContext);

    return (
        <Collapse in={visible}>
            <div>
                <Alert
                    severity={flashMessage.type || "info"}
                    onClose={hideFlash}
                    action={
                        <IconButton
                            aria-label="close" 
                            color="inherit" size="small"
                            onClick=
                            {() => {
                                hideFlash()
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                        
                    }
                    sx={{ mb: 3 }}
                >
                    {flashMessage.message}
                </Alert>
            </div>
        </Collapse>
    );
}
