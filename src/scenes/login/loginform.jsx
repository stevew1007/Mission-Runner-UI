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

const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required."),
    password: yup.string().required("Password is required."),
});

// const initialValuesRegister = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
// };

const initialValuesLogin = {
    username: "",
    password: "",
};

const LoginForm = () => {
    const { login } = useUser();
    const flash = useFlash();
    const navigate = useNavigate()
    const location = useLocation()

    const handleFormSubmit = async (values, onSubmit) => {
        // print username & pssword to console for debug
        onSubmit.setSubmitting(true);
        const result = await login(values.username, values.password);
        if (result === 'fail') {
            onSubmit.setSubmitting(false);
            onSubmit.setFieldValue("password", "", false);
            flash("用户名或密码错误", "error", 10);
        }
        else if (result === 'ok') {
            flash("登录成功", "success");
            formik.setSubmitting(false);
            let next = "/";
            if (location.state && location.state.next) {
                next = location.state.next;
            }
            navigate(next);
        }
    };

    const formik = useFormik({
        initialValues: initialValuesLogin,
        validationSchema: loginSchema,
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
                        error={
                            formik.touched.password && formik.errors.password
                        }
                        helperText={
                            formik.touched.username && formik.errors.username
                                ? formik.errors.username
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
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.password && formik.errors.password
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
                    >
                        Submit
                    </LoadingButton>
                </Stack>
            </form>
        </div>
    );
};

export default LoginForm;

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
