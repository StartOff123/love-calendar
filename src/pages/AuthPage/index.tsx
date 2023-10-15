import React from 'react'
import api from '../../api'
import { Input, Button, Form, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Navigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { IErrorResponse } from '../../types/errorResponse'
import { IUser } from '../../types/user'
import { UserContext } from '../../App'

import '../../styles/auth.scss'

const AuthPage = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<IUser | null>> }): React.ReactElement => {
    const user: IUser | null = React.useContext(UserContext)
    const [errorResponse, setErrorResponse] = React.useState<IErrorResponse | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const forkik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: async values => {
            setIsLoading(true)
            api.post('/auth/login', values)
                .then(response => {
                    setUser(response.data)
                    setIsLoading(false)
                })
                .catch((error) => {
                    setErrorResponse(error.response?.data)
                    setIsLoading(false)
                })
        }
    })

    return (
        <div className='auth'>
            {user && <Navigate to='/' />}
            <div className='auth__form'>
                <h1>Авторизация</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    labelCol={{ xs: { span: 3 } }}
                    wrapperCol={{ xs: { span: 21 } }}
                    initialValues={{ remember: true }}
                    onFinish={forkik.handleSubmit}
                >
                    <Form.Item
                        name="username"
                        label={<UserOutlined className="site-form-item-icon" />}
                        rules={[{ required: true, message: 'Пожалуйста заполни это поле', }]}
                    >
                        <Input
                            name='username'
                            className='auth__form-input'
                            placeholder='Логин'
                            value={forkik.values.username}
                            onChange={forkik.handleChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label={<LockOutlined className="site-form-item-icon" />}
                        rules={[{ required: true, message: 'Пожалуйста заполни это поле' }]}
                    >
                        <Input.Password
                            name='password'
                            className='auth__form-input'
                            placeholder='Пароль'
                            value={forkik.values.password}
                            onChange={forkik.handleChange}
                        />
                    </Form.Item>
                    <Button
                        rootClassName='auth__form-btn'
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        {isLoading ? <span className='auth__form-loading'></span> : 'Войти'}
                    </Button>
                    {errorResponse && <Alert type='error' message={errorResponse?.message} showIcon className='auth__form-alert' />}
                </Form>
            </div>
        </div>
    )
}

export default AuthPage