import { useTheme } from "@emotion/react";
import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import PropTypes from "prop-types";
import moment from "moment";
import { LoadingButton } from "@mui/lab";
import { mockDataMission, mockDataMissionSingle } from "../data/mockData";
import { useState } from "react";

const entrySchema = yup.object().shape({
    entry: yup.string().required("请输入至少一个任务信标"),
});

const initialValuesEntry = {
    entry: "",
};

const MissionMatcher = ({ keyword, identified, cannotid }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [entryValue, setEntryValue] = useState(mockDataMission);
    const [mission, setMission] = useState();

    const handleUpdate = (event) => {
        // console.log(event)
        setEntryValue(event.target.value);
    };

    const handleParsing = async () => {
        let jsonfy = JSON.stringify(entryValue).replace(/^"(.*)"$/, "$1");
        let lst_str = jsonfy.split("\\n");
        // console.log(lst_str)
        let dataArray = lst_str.map((line, index) => {
            console.log(line);
            let lineArray = line.split("\\t");

            return {
                id: index,
                name: lineArray[0],
                type: lineArray[1],
                // no_jump: lineArray[2],
                galaxy: lineArray[3],
                // system: lineArray[4],
                region: lineArray[5],
                created: lineArray[6],
                account_name: lineArray[8],
            };
        });
        console.log(dataArray);
        setMission(dataArray);
    };

    const columns = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5,
            renderCell: ({ row: { id, published } }) => {
                return published === undefined ? (
                    <Box>--</Box>
                ) : (
                    <Box>{id}</Box>
                );
            },
        },
        {
            field: "name",
            headerName: "Name",
            flex: 4,
            cellClassName: "name-column--cell",
        },
        {
            field: "account_name",
            headerName: "发布账号",
            headerAlign: "center",
            align: "center",
            flex: 1.5,
        },
        {
            field: "account_status",
            headerName: "账号状态",
            headerAlign: "center",
            align: "center",
            flex: 1.5,
            renderCell: ({ row: { status } }) => {
                return (
                    <Chip
                        label={status != undefined ? "已激活" : "未激活"}
                        color={status != undefined ? "success" : undefined}
                        variant={status != undefined ? undefined : "outlined"}
                    />
                );
            },
        },
        {
            field: "galaxy",
            headerName: "星系",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "region",
            headerName: "星域",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        
        
        {
            field: "created",
            headerName: "信标创建",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { created } }) => {
                return <Box>{moment(created).fromNow()}</Box>;
            },
        },
        {
            field: "published",
            headerName: "发布时间",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { published } }) => {
                return published === undefined ? (
                    <Box>--</Box>
                ) : (
                    <Box>{moment(published).fromNow()}</Box>
                );
            },
        },
        {
            field: "expired",
            headerName: "过期时间",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { expired } }) => {
                return expired === undefined ? (
                    <Box>--</Box>
                ) : (
                    <Box>{moment(expired).fromNow()}</Box>
                );
            },
        },
        {
            field: "status",
            headerName: "发布状态",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { status } }) => {
                return (
                    <Chip
                        label={status != undefined ? "发布中" : "未发布"}
                        color={status != undefined ? "success" : undefined}
                        variant={status != undefined ? undefined : "outlined"}
                    />
                );
            },
        },
    ];

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
                    value={entryValue}
                    onChange={handleUpdate}
                    error={false}
                    helperText={" "}
                    rows={4}
                    // placeholder="Test"
                />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    // mt={2}
                    mb="10px"
                >
                    <Button
                        variant="outlined"
                        color="success"
                        // type="submit"
                        onClick={handleParsing}
                        // loading={formik.isSubmitting}
                    >
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
                    rows={mission === undefined ? [] : mission}
                    // loading={mission === undefined}
                    columns={columns}
                />
            </Box>

            {cannotid != undefined ? (
                <>
                    <Box mt={2}>
                        <Typography variant="h7">
                            无法识别(检查输入或者联系管理员):
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
                            rows={cannotid}
                            columns={columns}
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
    identified: PropTypes.array,
    cannotid: PropTypes.array,
};

export default MissionMatcher;
