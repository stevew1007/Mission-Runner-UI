import { useTheme } from "@emotion/react";
import {
    Box,
    Button,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { tokens } from "../theme";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";

const MissionMatcher = ({
    keyword,
    columns,
    rejCol,
    handleParsing,
    handleValidate,
    handleAll,
    missions,
    bounty,
    setBounty,
    // handleSelected,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const { missions } = useGlobal();
    const apiRefAcc = useGridApiRef();
    const inputRef = useRef(null);
    // const apiRefRej = useGridApiRef();

    const [entryState, setEntryState] = useState({
        value: "",
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

    const handleClickAll = () => {
        if (handleValidate === undefined) {
            if (entryState.value === "") {
                updateEntryState({ error: true, helperText: "输入不能为空" });
                return;
            }
        }
        // console.log('bounty::: ', bounty);
        if (bounty != undefined) {
            if (inputRef.current.value === "") {
                setBounty({
                    ...bounty,
                    ...{ error: true, helperText: "输入不能为空" },
                });
                return;
            }
            let val = parseInt(inputRef.current.value.replace(/,/g, ""));
            setBounty({ ...bounty, ...{ value: val } });
        }
        handleAll();
    };

    const CustomTextFieldNumeric = (props) => {
        return (
            <TextField
                {...props}
                size={"small"}
                variant="standard"
                sx={{ mr: 2, width: "auto" }}
                inputProps={{
                    style: { textAlign: "right" },
                }}
            />
        );
    };

    // const NumberFormatCustom = forwardRef(function NumberFormatCustom(
    //     props, ref
    // ) {
    //     const { ...other } = props;

    //     return (
    //         <NumericFormat
    //             {...other}
    //             getInputRef={ref}
    //             // onValueChange={(values) => {

    //             // }}
    //             thousandSeparator
    //             isNumericString
    //         />
    //     );
    // });

    // NumberFormatCustom.propTypes = {
    //     // ref: PropTypes.string,
    //     name: PropTypes.string,
    //     onChange: PropTypes.func,
    // };

    useEffect(() => {
        if (missions != undefined) {
            // console.log(missions)
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
                />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    // mt={2}
                    // mb="10px"
                >
                    <Box justifyContent="flex" mt="auto" mb="auto">
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
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            columnSpacing={2}
                        >
                            {bounty != undefined && (
                                <Grid item width="150px">
                                    <NumericFormat
                                        thousandSeparator
                                        label="默认打手费/任务"
                                        value={bounty.value}
                                        error={bounty.error}
                                        helperText={bounty.helperText}
                                        onFocus={(e) => e.target.select()}
                                        // isAllowed={() => true}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    ISK
                                                </InputAdornment>
                                            ),
                                        }}
                                        customInput={CustomTextFieldNumeric}
                                        inputRef={inputRef}
                                    />
                                </Grid>
                            )}
                            {/* <Grid item>
                                <Button
                                    variant="outlined"
                                    disableElevation
                                    color="success"
                                    // onClick={handleSelected}
                                    // sx={{ mr: 2 }}
                                    sx={{ mt: "auto", mb: "auto" }}
                                >
                                    {keyword}选中
                                </Button>
                            </Grid> */}

                            <Grid item>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    color="success"
                                    onClick={handleClickAll}
                                    sx={{ mt: "auto", mb: "auto" }}
                                    // color="primrary"
                                >
                                    {keyword}所有
                                </Button>
                            </Grid>
                        </Grid>
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
                            无法处理(请检查输入或者联系管理员):
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
    rejCol: PropTypes.array,
    handleParsing: PropTypes.func,
    handleValidate: PropTypes.func,
    handleAll: PropTypes.func,
    missions: PropTypes.array,
    bounty: PropTypes.any,
    setBounty: PropTypes.func,
};

export default MissionMatcher;
