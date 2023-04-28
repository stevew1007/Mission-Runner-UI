import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Body from "../../components/Body";
import { useEffect, useState } from "react";
import { useGlobal } from "../../contexts/GlobalProvider";
import { useUser } from "../../contexts/UserProvider";
// import { useFlash } from "../../contexts/FlashProvider";
import {
    created_field,
    expired_field,
    galaxy_field,
    id_field,
    title_field,
} from "../../data/columnsFieldSetting";
// import FlashMessage from "../../components/FlashMessage";

const Paying = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { user } = useUser();
    const { api } = useGlobal();
    const [missions, setMissions] = useState();
    // const [hoverID, setHoverID] = useState();
    // const flash = useFlash();

    useEffect(() => {
        (async () => {
            const response = await api.get("/missions/state/completed");
            if (response.ok) {
                const results = await response.body;
                console.log(response);
                setMissions(results.data);
            } else {
                setMissions(null);
            }
        })();
    }, [api, user]);

    const columns = [
        id_field,
        // name_field,
        title_field,
        {
            field: "publisher",
            headerName: "发布账号",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { publisher } }) => {
                // console.log(mission_id);
                return <Box>{publisher.name}</Box>;
            },
        },
        {
            field: "runner",
            headerName: "打手",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { runner } }) => {
                // console.log(mission_id);
                return <Box>{runner.username}</Box>;
            },
        },
        galaxy_field,
        created_field,
        expired_field,
        // mission_status_field,
    ];

    // const l = await Z3(r.value.map(c=>c.cname2))
    //                   , u = `<font size="14" color="#ffd98d00">${r.value.map(c=>`<a href="showinfo:1383//${l[c.cname2.trim().toLowerCase()]}">${c.cname2}</a>`).join("<br/>")}</font>`;

    return (
        <Body
            topbar={true}
            title="费用结算"
            subtitle="快结账 老板们，文件夹就要满了"
        >
            <Typography variant="h7">已经标记完成的任务：</Typography>
            {/* <Typography variant="body2" sx={{ mt: "2px", mb: 2 }}> */}
            {/* {accounts === null ?  : ""} */}

            {/* {(accounts === undefined || accounts.length == 0) &&
                    "没有显示账号？"}
                <Typography variant="h7">
                    <Link variant="subtitle2" to="/register_account">
                        注册新账号
                    </Link>
                </Typography> */}
            {/* </Typography> */}
            <Box
                // m="10px 0 0 0"
                // height="50vh"
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
                    // slotProps={{
                    //     row: {
                    //         onMouseEnter: (params) => {
                    //             // Get the corresponding account id for the selected row
                    //             // const rowID =
                    //             // const row = accounts[params.currentTarget.dataset.id]

                    //             setHoverID(
                    //                 missions[
                    //                     params.currentTarget.dataset.rowindex
                    //                 ].id
                    //             );
                    //             // console.log(
                    //             //     `Accounts No.${params.currentTarget.dataset.rowindex} is ${hoverID}`
                    //             // );
                    //             console.log(user.default_account_id);
                    //         },
                    //         onMouseLeave: () => {
                    //             setHoverID();
                    //         },
                    //     },
                    // }}
                    checkboxSelection
                    rows={missions === undefined ? [] : missions}
                    loading={missions === undefined}
                    columns={columns}
                />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    // mt={2}
                    mb={3}
                >
                    <Box>
                        <Button
                            variant="outlined"
                            color="success"
                            // type="submit"
                            // onClick={handleClick}
                        >
                            结算
                        </Button>
                    </Box>
                    <Box>
                        {/* <Button
                            variant="outlined"
                            disableElevation
                            color="success"
                            onClick={handleSelected}
                            sx={{ mr: 2 }}
                        >
                            {keyword}选中
                        </Button> */}
                        <Button
                            variant="contained"
                            disableElevation
                            color="success"
                            // onClick={handleAll}
                            // color="primrary"
                        >
                            所有
                        </Button>
                    </Box>
                </Box>
                <DataGrid
                    autoHeight
                    checkboxSelection
                    rows={missions === undefined ? [] : missions}
                    loading={missions === undefined}
                    columns={columns}
                />
            </Box>
        </Body>
    );
};

export default Paying;
