import {FC} from "react";
import {Outlet} from "react-router-dom";
import styles from './RootLayout.module.css'
import {Header} from "../../components/Header/Header";


export const RootLayout: FC = () => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.contentWrapper}>
                <Outlet />
            </div>
        </div>
    )
}
