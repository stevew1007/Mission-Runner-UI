import {
    Stack,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useUser } from "../../contexts/UserProvider";
import { useGlobal } from "../../contexts/GlobalProvider";
import { useFlash } from "../../contexts/FlashProvider";

const loginSchema = yup.object().shape({
    name: yup.string().required("Account name is required"),
    lp_point: yup.integer()
});

const initialValues = {
    name: "",
    lp_point: "",
};

const Form = () => {
    const { login } = useUser();
    const { api } = useGlobal();
    const flash = useFlash();

    const handleFormSubmit = async (values, onSubmit) => {
        // print username & pssword to console for debug
        onSubmit.setSubmitting(true);
        // const result = await api.post("/accounts", values);
        // if (result === 'fail') {
        //     onSubmit.setSubmitting(false);
        //     onSubmit.setFieldValue("password", "", false);
        //     flash("用户名或密码错误", "error", 10);
        // } 
        // if (result === 'ok') {
        //     flash("登录成功", "success");
        //     formik.setSubmitting(false);
            
        // } else {
        //     flash(`HTTP错误: ${result}, 请重试`, "error", 10);
        //     onSubmit.setSubmitting(false);
            
        // }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: handleFormSubmit,
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={1}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="角色名"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.password && formik.errors.password
                        }
                        helperText={
                            formik.touched.username && formik.errors.username
                            ? formik.errors.username : " "
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
                            formik.touched.password && formik.errors.password
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
                            ? formik.errors.password : " "
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

export default Form;
