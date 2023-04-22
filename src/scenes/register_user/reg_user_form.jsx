import { useState } from "react";
import { Stack, IconButton, InputAdornment, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useUser } from "../../contexts/UserProvider";
import { useFlash } from "../../contexts/FlashProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobal } from "../../contexts/GlobalProvider";

const formSchema = yup.object().shape({
    username: yup.string().required("需要输入用户名"),
    email: yup.string().email().required("需要输入邮箱"),
    im_number: yup
        .string()
        .matches(/^[1-9]{1}[0-9]{4,14}$/, "请输入正确的QQ号格式")
        .required("需要输入QQ号"),
    password: yup.string().required("需要输入密码"),
});

const initialValues = {
    username: "",
    email: "",
    im_number: "",
    password: "",
};

const RegUserForm = () => {
    const { api } = useGlobal();
    const { login } = useUser();
    const flash = useFlash();
    const navigate = useNavigate();
    const location = useLocation();

    const handleFormSubmit = async (values, onSubmit) => {
        onSubmit.setSubmitting(true);
        const result = await api.post("/users", values);
        if (result.ok) {
            onSubmit.setSubmitting(false);
            const loginResult = await login(values.username, values.password);
            if (loginResult === "fail") {
                flash("注册成功, 请登录", "success", 10);
                navigate("/login");
            } else if (result === "ok") {
                flash("注册成功", "success", 10);
                let next = "/";
                if (location.state && location.state.next) {
                    next = location.state.next;
                }
                navigate(next);
            }
        } else {
            onSubmit.setSubmitting(false);
            onSubmit.setFieldValue("password", "", false);
            flash(`注册出错 HTTP ${result.status}`, "error", 10);
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: formSchema,
        onSubmit: handleFormSubmit,
    });

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={1}>
                    <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="用户名"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        error={
                            formik.touched.username &&
                            formik.errors.username != undefined
                        }
                        helperText={
                            formik.touched.username && formik.errors.username
                                ? formik.errors.username
                                : " "
                        }
                    />
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="邮箱"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        error={
                            formik.touched.email &&
                            formik.errors.email != undefined
                        }
                        helperText={
                            formik.touched.email && formik.errors.email
                                ? formik.errors.email
                                : " "
                        }
                    />
                    <TextField
                        fullWidth
                        id="im_number"
                        name="im_number"
                        label="QQ号"
                        value={formik.values.im_number}
                        onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        error={
                            formik.touched.im_number &&
                            formik.errors.im_number != undefined
                        }
                        helperText={
                            formik.touched.im_number && formik.errors.im_number
                                ? formik.errors.im_number
                                : " "
                        }
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="密码"
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        // onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.password &&
                            formik.errors.password != undefined
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
                                ? formik.errors.password
                                : " "
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        edge="end"
                                    >
                                        {showPassword === true ? (
                                            <VisibilityIcon />
                                        ) : (
                                            <VisibilityOffIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <LoadingButton
                        color="success"
                        variant="contained"
                        fullWidth
                        type="submit"
                        loading={formik.isSubmitting}
                        sx={{ mt: 1 }}
                    >
                        Submit
                    </LoadingButton>
                </Stack>
            </form>
        </div>
    );
};

export default RegUserForm;

{
    /* <Box>
<form onSubmit={formik.handleSubmit}>
    <Stack spacing={3}>
        <TextField
            name="用户名"
            label="用户名"
            // onBlur={handleBlur}
            onChange={formik.handleChange}
            value={formik.values.username}
            error={Boolean(
                formik.touched.username && formik.errors.username
            )}
            helperText={Boolean(
                formik.touched.username && formik.errors.username
            )}
        />

        <TextField
            name="密码"
            label="密码"
            type={showPassword ? "text" : "password"}
            // onBlur={handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            error={Boolean(
                formik.touched.password && formik.errors.password
            )}
            helperText={Boolean(
                formik.touched.password && formik.errors.password
            )}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            edge="end"
                        >
                            {showPassword === true ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    </Stack>

    <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 1 }}
    >
        <Box display="flex" alignItems="center" ml="-12px">
            <Checkbox label="Remember me" size="small" />
            <Typography ml="-6px">记住此账号</Typography>
        </Box>
        <Link variant="subtitle2" underline="hover">
            忘记密码？
        </Link>
    </Stack>

    <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="success"
        // onClick={handleClick}
    >
        Login
    </LoadingButton>
</form>
</Box> */
}
