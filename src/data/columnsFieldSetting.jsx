import { Box, Chip } from "@mui/material";
import moment from "moment";

export const id_field = {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    renderCell: ({ row: { id } }) => {
        // console.log(mission_id);
        return <Box>{id}</Box>
    },
};

export const mission_id_field = {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    renderCell: ({ row: { mission_id, mission_status } }) => {
        // console.log(mission_id);
        return mission_status === "not_published" ? (
            <Box>--</Box>
        ) : (
            <Box>{mission_id}</Box>
        );
    },
};

export const name_field = {
    field: "name",
    headerName: "Name",
    flex: 2.2,
    cellClassName: "name-column--cell",
};

export const title_field = {
    field: "title",
    headerName: "任务",
    flex: 2.2,
    cellClassName: "name-column--cell",
};

export const account_name_field = {
    field: "account_name",
    headerName: "发布账号",
    headerAlign: "center",
    align: "center",
    flex: 1.5,
};

export const publisher_field = {
    field: "publisher",
    headerName: "发布者",
    headerAlign: "center",
    align: "center",
    flex: 1,
}

export const account_status_field = {
    field: "account_status",
    headerName: "账号状态",
    headerAlign: "center",
    align: "center",
    flex: 1.5,
    renderCell: ({ row: { account_status } }) => {
        const checkStatus = () => {
            if (account_status === "已激活") {
                return {
                    label: "已激活",
                    color: "success",
                    variant: "outlined",
                };
            } else if (account_status === "未激活") {
                return { label: "未激活", variant: "outlined" };
            } else if (account_status === "错误") {
                return {
                    label: "错误",
                    color: "error",
                    variant: "outlined",
                };
            } else return { lable: "检查中", variant: "outlined" };
        };
        // let status = checkStatus();
        return (
            <Chip
                label={checkStatus().label}
                color={checkStatus().color}
                variant="outlined"
            />
        );
    },
};

export const galaxy_field = {
    field: "galaxy",
    headerName: "星系",
    headerAlign: "center",
    align: "center",
};

export const region_field = {
    field: "region",
    headerName: "星域",
    headerAlign: "center",
    align: "center",
    flex: 1,
};

export const created_field = {
    field: "created",
    headerName: "信标创建",
    type: "timestamp",
    headerAlign: "center",
    align: "right",
    flex: 1,
    renderCell: ({ row: { created } }) => {
        // console.log(created)
        return <Box>{moment.utc(created).format("Y/M/D H:mm")}</Box>;
    },
};

export const expired_field = {
    field: "expired",
    headerName: "过期时间",
    type: "number",
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: ({ row: { expired, mission_status } }) => {
        return mission_status === "not_published" ? (
            <Box>--</Box>
        ) : (
            <Box>{moment(expired).fromNow()}</Box>
        );
    },
};

export const bounty_field = {
    field: "bounty",
    headerName: "打手费",
    type: "number",
    headerAlign: "center",
    align: "center",
    flex: 1.5,
    renderCell: ({ row: { bounty } }) => {
        return bounty === undefined ? (
            <Box>--</Box>
        ) : (
            <Box>{new Intl.NumberFormat("is-IS", {
                style: "currency",
                currency: "ISK",
            }).format(bounty)}</Box>
        );
    },
}

export const mission_status_field = {
    field: "status",
    headerName: "发布状态",
    headerAlign: "center",
    align: "center",
    flex: 1,
    renderCell: ({ row: { mission_status } }) => {
        const checkStatus = () => {
            switch (mission_status) {
                case "not_published":
                    return { label: "未发布", variant: "outlined" };
                case "published":
                    return {
                        label: "发布中",
                        color: "success",
                        // variant: "outlined",
                    };
                case "accepted":
                    return {
                        label: "已接受",
                        color: "success",
                        variant: "outlined",
                    };
                case "completed":
                    return {
                        label: "已完成",
                        color: "success",
                        variant: "outlined",
                    };
                case "paid":
                    return {
                        label: "已支付",
                        color: "success",
                        variant: "outlined",
                    };
                case "archived":
                    return {
                        label: "已归档",
                        variant: "outlined",
                    };
                case "done":
                    return {
                        label: "已付清",
                        variant: "outlined",
                    };
                case "fault":
                    return {
                        label: "错误",
                        color: "error",
                        variant: "outlined",
                    };
                default:
                    return {
                        lable: "检查中",
                        variant: "outlined",
                    };
            }
        };
        // let status = checkStatus();
        // console.log(checkStatus());
        return (
            <Chip
                label={checkStatus().label}
                color={checkStatus().color}
                variant={checkStatus().variant}
            />
        );
    },
};

export const error_field = {
    field: "error",
    headerName: "报错",
    headerAlign: "center",
    align: "center",
    flex: 1,
};