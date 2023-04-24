import { useTheme } from "@emotion/react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { tokens } from "../theme";
import PropTypes from "prop-types";

import { LoadingButton } from "@mui/lab";
import { mockDataMission, mockDataMissionSingle } from "../data/mockData";
import { useEffect, useState } from "react";
import { useGlobal } from "../contexts/GlobalProvider";

const MissionMatcher = ({
    keyword,
    columns,
    rejCol,
    handleParsing,
    handleValidate,
    
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { missions } = useGlobal();
    const apiRefAcc = useGridApiRef();
    // const apiRefRej = useGridApiRef();

    const [entryState, setEntryState] = useState({
        value: mockDataMission,
        error: false,
        helperText: " ",
        showRej: false,
    });

    const [accRow, setAccRow] = useState(() => []);
    const [rejRow, setRejRow] = useState(() => []);

    const updateEntryState = (values) => {
        const newState = { ...entryState, ...values };
        setEntryState(newState);
    };

    const handleUpdate = (event) => {
        // console.log(event)
        updateEntryState({ value: event.target.value });
    };

    const handleClick = () => {
        if (handleValidate === undefined) {
            if (entryState.value === "") {
                updateEntryState({ error: true, helperText: "输入不能为空" });
                return;
            }
        }
        handleParsing(entryState.value);
    };

    useEffect(() => {
        if (missions != undefined) {
            let mission_deepcopy = JSON.parse(JSON.stringify(missions));

            let accept_dc = mission_deepcopy.filter(
                (mission) => !mission.error
            );
            let reject_dc = mission_deepcopy.filter((mission) => mission.error);
            reject_dc != undefined && updateEntryState({ showRej: true });
            setAccRow(accept_dc === undefined ? [] : accept_dc);
            setRejRow(reject_dc === undefined ? [] : reject_dc);
        }
    }, [missions]);

    return (
        <>
            <Box>
                <Typography variant="h7">
                    从文件夹复制要{keyword}的任务点信标:
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
                    label="信标"
                    multiline
                    fullWidth
                    value={entryState.value}
                    onChange={handleUpdate}
                    error={entryState.error}
                    helperText={entryState.helperText}
                    rows={4}
                    // placeholder="Test"
                />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    // mt={2}
                    mb="10px"
                >
                    <Box>
                        <Button
                            variant="outlined"
                            color="success"
                            // type="submit"
                            onClick={handleClick}
                        >
                            解析
                        </Button>
                    </Box>
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
                <Typography variant="h7">工作区</Typography>
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
                    apiRef={apiRefAcc}
                    autoHeight
                    checkboxSelection
                    rows={accRow}
                    loading={entryState.isSubmitting}
                    columns={columns}
                />
            </Box>
            {rejRow != undefined && rejRow.length > 0 ? (
                <>
                    <Box mt={2}>
                        <Typography variant="h7">
                            无法处理(检查输入或者联系管理员):
                        </Typography>
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
                            rows={rejRow}
                            columns={rejCol}
                        />
                    </Box>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

MissionMatcher.propTypes = {
    keyword: PropTypes.string,
    columns: PropTypes.array,
    handleParsing: PropTypes.func,
    handleValidate: PropTypes.func,
};

export default MissionMatcher;
