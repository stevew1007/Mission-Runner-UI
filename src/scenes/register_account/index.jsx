import {
    useTheme,
    styled,
} from "@mui/material";
import { tokens } from "../../theme";
// import Form from "./form";
import RegisterAccountForm from "./reg_acc_form";
import { useGlobal } from "../../contexts/GlobalProvider";
import FlashMessage from "../../components/FlashMessage";
import Body from "../../components/Body";

const RegisterAccountPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const { toggleMode } = useGlobal();

    return (
        <Body topbar={true} title="登记角色" subtitle="这个账号不知道谁的没有登记">
            <RegisterAccountForm />
        </Body>
    );
};

export default RegisterAccountPage;
