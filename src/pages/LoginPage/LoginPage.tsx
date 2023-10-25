import {FC} from "react";
import styles from './LoginPage.module.css'
import {LoginForm} from "../../components/LoginForm/LoginForm";


export const LoginPage: FC = () => {
    return (
        <div className={styles.wrapper}>
            <LoginForm />
        </div>
    )
}
