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
    email: yup.string().email().required("需要输入邮箱"),
});

const initialValues = {
    email: "",
};

const ReqPwResetForm = () => {
    const { api } = useGlobal();
    const { login } = useUser();
    const flash = useFlash();
    const navigate = useNavigate();
    const location = useLocation();

    const handleFormSubmit = async (values, onSubmit) => {
        onSubmit.setSubmitting(true);
        const result = await api.post("/tokens/reset", values);
        if (result.ok) {
            flash(
                "如果您的电子邮件地址存在于我们的数据库中，" + 
                "您将在几分钟后在您的电子邮件地址中收到一个密码恢复链接。",
                "info",
                10
            );
            navigate("/login");
        } else {
            onSubmit.setSubmitting(false);
            onSubmit.setFieldValue("password", "", false);
            flash(`服务器出错 HTTP ${result.status}`, "error", 10);
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: formSchema,
        onSubmit: handleFormSubmit,
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={1}>
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

export default ReqPwResetForm;
