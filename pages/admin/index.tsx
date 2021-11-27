import React from "react";
import { Form, Input } from 'antd';
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import "../../styles/AdminHome.module.less";
import Head from "next/head";
import {useRouter} from "next/router";

export default function AdminHome() {
    /*router*/
    const router = useRouter();
    const onFinish = (values: {username: string, password: string}) => {
        // console.log('Success:', values);
        if (values.username.toLowerCase() === 'admin' && values.password === 'admin') {
            if (typeof window !== "undefined") {
                window.sessionStorage.setItem('aBth', 'aBth');
            }
            router.push('/admin/dashboard');
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    return(
        <>
            <Head>
                <title>Login to BICHE Admin</title>
            </Head>
            <section className="_body">
                <div className="overlay">
                    <section id="form">
                        <div className="header text-center mb-4">
                            <h1 className="font-nectar text-white font-bold text-xl">BICHE</h1>
                            <small>A D M I N</small>
                        </div>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input size="large" prefix={<UserOutlined/>} placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password prefix={<LockOutlined/>} size="large" placeholder="Password" />
                            </Form.Item>

                            <div className="py-3">
                                <button type="submit" className="btn-fill block w-full">
                                    LOGIN
                                </button>
                            </div>
                        </Form>
                    </section>
                </div>
            </section>
        </>
    )
}

