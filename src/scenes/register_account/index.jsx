import RegisterAccountForm from "./reg_acc_form";
import Body from "../../components/Body";

const RegisterAccountPage = () => {

    return (
        <Body
            topbar={true}
            title="登记角色"
            subtitle="这个账号不知道谁的没有登记"
        >
            <RegisterAccountForm />
        </Body>
    );
};

export default RegisterAccountPage;
