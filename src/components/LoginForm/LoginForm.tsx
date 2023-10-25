import {FC} from "react";
import styles from './LoginForm.module.css'
import {CloseCircleOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input, Spin, Typography} from 'antd';
import {LogInFormValues} from "../../Models/LogIn";
import {useAppDispatch, useAppSelector} from "../../helpers/redux-hook";
import {LogInUser} from "../../store/authSlice";

const { Paragraph } = Typography;


export const LoginForm: FC = () => {

    const { loading, error } = useAppSelector(state => state.auth)

    const dispatch = useAppDispatch()
    const onFinish = (values: LogInFormValues) => {
        console.log('Received values of form: ', values);
        dispatch(LogInUser(values));
    };

    const initialValues: LogInFormValues = {
        username: '',
        password: ''
    }

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Log in</h3>
            <Form
                name="normal_login"
                className="login-form"
                initialValues = {initialValues}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                            whitespace: true,
                        },
                        {
                            min: 1,
                            message: 'Username must have at least 1 character!',
                        },
                        {
                            max: 150,
                            message: 'Username can have at most 150 characters!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                            whitespace: true,
                        },
                        {
                            min: 1,
                            message: 'Password must have at least 1 character!',
                        },
                        {
                            max: 128,
                            message: 'Password can have at most 128 characters!',
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>

            <div className={styles.infoBlock}>
               {loading && <Spin size="large" />}

                 {error &&
                   <Paragraph style={{color : 'red'}}>
                     <CloseCircleOutlined className="site-result-demo-error-icon" /> {error} Failed to login.
                     Check that your username and password are correct.
                   </Paragraph>
                 }
            </div>

        </div>

    )
}
