import { useTheme } from "@emotion/react";
import { Box, Button, TextField, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { tokens } from "../theme";



const MissionMatcher = ({keyword, identified, cannotid }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "age",
            headerName: "Age",
            type: "number",
            headerAlign: "left",
            align: "left",
        },
        {
            field: "phone",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "accessLevel",
            headerName: "Access Level",
            flex: 1,
            renderCell: ({ row: { access } }) => {
                return (
                    <Box
                        width="60%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            access === "admin"
                                ? colors.greenAccent[600]
                                : access === "manager"
                                ? colors.greenAccent[700]
                                : colors.greenAccent[700]
                        }
                        borderRadius="4px"
                    >
                        {/* {access === "admin" && (
                            <AdminPanelSettingsOutlinedIcon />
                        )}
                        {access === "manager" && <SecurityOutlinedIcon />}
                        {access === "user" && <LockOpenOutlinedIcon />} */}
                        <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                            {access}
                        </Typography>
                    </Box>
                );
            },
        },
    ];

    return (
        <>
            <Box>
                <Typography variant="h7">
                    从文件夹复制要{keyword}的任务点信标
                </Typography>
            </Box>
            <Box
                m="20px 0 0 0"
                component="form"
                sx={{
                    "& .MuiTextField-root": { width: "100%" },
                }}
                noValidate
                autoComplete="off"
            >

                <TextField
                    id="outlined-multiline-static"
                    label="信标"
                    multiline
                    rows={4}
                    placeholder="Test"
                />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                    mb="10px"
                >
                    <Button variant="outlined" disableElevation color="success">
                        解析
                    </Button>
                    <Box>
                        <Button
                            variant="outlined"
                            disableElevation
                            color="success"
                            sx={{ mr: 2 }}
                        >
                            {keyword}选中
                        </Button>
                        <Button
                            variant="contained"
                            disableElevation
                            color="success"
                            // color="primrary"
                        >
                            {keyword}所有
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box mt={2}>
                <Typography variant="h7">可以识别：</Typography>
            </Box>

            <Box
                borderRadius="4px"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // backgroundColor: colors.primary[400],
                        // borderBottom: "1px #a3a3a3",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        // backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        // borderTop: "none",
                        // backgroundColor: colors.primary[400],
                        borderBottom: "1px #a3a3a3",
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    autoHeight
                    checkboxSelection
                    rows={identified}
                    columns={columns}
                />
            </Box>

            {
                cannotid != undefined ?
                    <>
                        <Box mt={2}>
                            <Typography variant="h7">无法识别(检查输入或者联系管理员):</Typography>
                        </Box>

                        <Box
                            borderRadius="4px"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                },
                                "& .name-column--cell": {
                                    color: colors.greenAccent[300],
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    // backgroundColor: colors.primary[400],
                                    // borderBottom: "1px #a3a3a3",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    // backgroundColor: colors.primary[400],
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    // borderTop: "none",
                                    // backgroundColor: colors.primary[400],
                                    borderBottom: "1px #a3a3a3",
                                },
                                "& .MuiCheckbox-root": {
                                    color: `${colors.greenAccent[200]} !important`,
                                },
                            }}
                        >
                            <DataGrid
                                autoHeight
                                checkboxSelection
                                rows={cannotid}
                                columns={columns}
                            />
                        </Box>
                    </>
                : <></>
            }
        </>
    )
};

export default MissionMatcher;