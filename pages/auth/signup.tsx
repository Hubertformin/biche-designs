import React, {useEffect, useState} from 'react';
import SeoTags from "../../components/seo-tags";
import '../../styles/auth.less';
import {Form, Input, Typography} from "antd";
import {fireAuth} from "../../firebase/clientApp";
import {useRouter} from "next/router";
import {usersCollection} from "../../firebase/db-service";
import Link from "next/link";
import {mapUserData} from "../../utils/auth/mapUserData";
import {setUserCookie} from "../../utils/auth/userCookies";

export function SignUp() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    function createAccount() {
        const {email, password, firstName, lastName} = form.getFieldsValue();
        setIsLoading(true);

        const displayName = `${firstName} ${lastName}`;
        // create account
        fireAuth.createUserWithEmailAndPassword(email, password)
            .then(async (userCred) => {
                await userCred.user.updateProfile({displayName: displayName});
                //send data to firestore
                await onBoardUser(usersCollection.doc(userCred.user.uid).set({...form.getFieldsValue(), displayName}));
            })
            .catch(err => {
                setLoginError(err.message);
            }).finally(() => {
            setIsLoading(false);
        });
    }

    function onBoardUser(prom: Promise<any>) {
        return prom
            .then((userCred) => {
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

    return(
        <>
            <SeoTags title={"Create account"} />
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
                        <Typography.Title level={4}>Create account</Typography.Title>
                        {
                            loginError ?
                                <p className="error-msg">{loginError}</p> :
                                <p>welcome to the family, create account to continue..</p>
                        }

                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        colon={false}
                        onFinish={createAccount}
                    >
                        <div className="row">
                            <div style={{paddingLeft: 0}} className="col-sm-6">
                                <Form.Item
                                    label={"First name"}
                                    name="firstName"
                                    required
                                    hasFeedback
                                    rules={[{ required: true, message: "Your name is required" }]}
                                >
                                    <Input size="large" placeholder={"First name"} />
                                </Form.Item>
                            </div>
                            <div style={{paddingRight: 0}} className="col-sm-6">
                                <Form.Item
                                    label={"Last name"}
                                    name="lastName"
                                    required
                                    hasFeedback
                                    rules={[{ required: true, message: "Your name is required" }]}
                                >
                                    <Input size="large" placeholder={"Last name"} />
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item
                            label={"Email"}
                            name="email"
                            required
                            hasFeedback
                            rules={[{ required: true, message: "Your email is required" }]}
                        >
                            <Input size="large" type="email" placeholder={"Enter your email"} />
                        </Form.Item>
                        <Form.Item
                            label={"Password"}
                            name="password"
                            required
                            hasFeedback
                            rules={[{ required: true, message: "Please enter your password" }]}
                        >
                            <Input.Password size="large" placeholder={"Enter your password"} />
                        </Form.Item>
                        <Form.Item
                            label={"confirm password"}
                            name="confirmPassword"
                            required
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The passwords do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" placeholder={"Confirm password"} />
                        </Form.Item>
                        <Form.Item>
                            <button type="submit" disabled={isLoading} className="btn-fill w-full mt-4">{
                                isLoading ? 'Creating account...' : 'Create account'
                            }</button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </>
    );
}


export default SignUp;
