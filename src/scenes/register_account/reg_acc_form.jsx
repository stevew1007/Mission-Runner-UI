import { Stack, TextField, Box, Checkbox, Typography, FormControlLabel } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";

import { useGlobal } from "../../contexts/GlobalProvider";
import { useFlash } from "../../contexts/FlashProvider";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
    name: yup.string().required("角色名不能为空"),
    lp_point: yup.number(),
});

const initialValues = {
    name: "",
    lp_point: 0,
    continue: false,
};

const RegisterAccountForm = () => {
    // const { login } = useUser();
    const { api } = useGlobal();
    const flash = useFlash();
    const navigate = useNavigate();

    const handleFormSubmit = async (values, onSubmit) => {
        // print username & pssword to console for debug
        onSubmit.setSubmitting(true);
        let sending = {
            name: values.name,
            lp_point: values.lp_point,
        };
        const result = await api.post("/accounts", sending);
        if (!result.ok) {
            onSubmit.setSubmitting(false);
            flash(`注册出错 HTTP : ${result.status}, 请重试`, "error", 10);
        } else {
            flash("注册成功", "success");
            formik.setValues(initialValues);
            formik.setSubmitting(false);
            if (values.continue) {
                formik.setValues(initialValues);
            } else {
                navigate("/account");
            }
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: handleFormSubmit,
    });

    return (
        <Box mt="10px">
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={1}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="角色名"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && formik.errors.name}
                        helperText={
                            formik.touched.name && formik.errors.name
                                ? formik.errors.name
                                : " "
                        }
                    />
                    <TextField
                        fullWidth
                        id="lp_point"
                        name="lp_point"
                        label="忠诚点"
                        value={formik.values.lp_point}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.lp_point && formik.errors.lp_point
                        }
                    />
                    <Box display="flex" alignItems="center">
                        <FormControlLabel
                            control={<Checkbox checked={formik.values.continue} />}
                            label={formik.values.continue ? "继续登记下一个角色" : "跳转到角色列表"}
                            name="continue"
                            onChange={formik.handleChange}
                            // sx={{ ml: '-6px' }}
                        />
                        {formik.values.continue}
                    </Box>
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
        </Box>
    );
};

export default RegisterAccountForm;
