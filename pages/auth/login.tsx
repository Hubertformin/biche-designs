import React, {useState} from 'react';
import SeoTags from "../../components/seo-tags";
import '../../styles/auth.less';
import {Form, Input, Typography} from "antd";
import {useRouter} from "next/router";
import {fireAuth} from "../../firebase/clientApp";
import Link from "next/link";
import {setUserCookie} from "../../utils/auth/userCookies";
import {mapUserData} from "../../utils/auth/mapUserData";

export function Login() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    function onBoardUser(prom: Promise<any>) {
        prom
            .then(async (userCred) => {
                const url = `/${router.query.src}` || '/';
                const userData = mapUserData(userCred.user);
                setUserCookie(userData);
                // @ts-ignore
                router.push(url);
            })
            .catch(err => {
                setLoginError(err.message);
            }).finally(() => {
            setIsLoading(false);
        });
    }

    function login() {
        const {email, password} = form.getFieldsValue();
        setIsLoading(true);
        // login user
        onBoardUser(fireAuth.signInWithEmailAndPassword(email, password));

    }

    return(
        <>
            <SeoTags title={"Login"} />
            <section className="login-body">
                <div className="image-section">
                    <div className="overlay"/>
                </div>
                <div className="form-section px-6 md:px-24">
                    <div className="header text-center">
                        <Link href="/">
                            <img style={{margin: 'auto', height: '75px', marginBottom: '15px'}}
                                 src="https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Ftext-logo.png?alt=media&token=1b860f6c-ab2d-4200-a02a-12a203460d84"
                                 alt=""/>
                        </Link>
                        <Typography.Title level={4}>Login</Typography.Title>
                        {
                            loginError ?
                                <p className="error-msg">{loginError}</p> :
                                <p>welcome back, continue to BICHE..</p>
                        }
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        colon={false}
                        onFinish={login}
                    >
                        <Form.Item
                            label={"Email"}
                            name="email"
                            required
                            hasFeedback
                            rules={[{ required: true, message: "Email is required" }]}
                        >
                            <Input size="large" placeholder={"Please enter your email"} />
                        </Form.Item>
                        <Form.Item
                            label={"Password"}
                            name="password"
                            required
                            hasFeedback
                            rules={[{ required: true, message: "Please enter your password" }]}
                        >
                            <Input.Password size="large" placeholder={"Enter your email"} />
                        </Form.Item>
                        <Form.Item>
                            <button disabled={isLoading} type="submit" className="btn-fill w-full mt-4">
                                {isLoading ? 'Loading..' : 'Login'}
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </>
    );
}


export default Login;
