import React, {useState} from 'react';
import Nav from "../components/nav";
import '../styles/BookSession.module.less';
import {Form, Input, message} from "antd";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons/lib";
import SeoTags from "../components/seo-tags";
import {dbService} from "../firebase/db-service";
import FooterComponent from "../components/footer";

function BookSession() {
    const [firstForm] = Form.useForm();
    const [secondForm] = Form.useForm();
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    function nextStep(step: 'NEXT' | 'PREV') {
        if (step === "NEXT" && stepIndex < 1) {
            firstForm.validateFields()
                .then(res => {
                    setStepIndex(1);
                }).catch(err => console.error(err));
        } else if (step === "PREV" && stepIndex > 0) {
            setStepIndex(0);
        } else {
            // submit
            secondForm.validateFields()
                .then(res => {
                    const payload = {...firstForm.getFieldsValue(), ...secondForm.getFieldsValue(), date: Date.now(), replied: false};
                    // submit to database
                    setLoading(true);
                    dbService
                        .addBooking(payload)
                        .then(() => {
                            setSubmitSuccess(true);
                        })
                        .catch(err => {
                            console.error(err);
                            message.error('There was an error submitting your request. Please try again later!');
                        })
                        .finally(() => {
                            setLoading(false);
                        });


                })
                .catch(err => console.error(err));
        }
    }

    return(
        <>
            <SeoTags title="Book a session" />
            <Nav />
            <section className="book-body pb-10">
                <div className="image-section">
                    <div className="overlay p-6 md:px-8">
                        <h1 className="text-white text-3xl text-theme-primary font-bold">Hi there!</h1>
                        <p>Welcome to the first part of your journey. I will like to know a few things about you</p>
                        <p>so please answer this questionnaire very honestly</p>
                    </div>
                </div>
                <div className="form-section px-6 md:px-16 xl:px-32">
                    {
                        !submitSuccess ? (<div className="book-form h-full pt-6">
                                <div className={`form__step ${stepIndex === 0 ? 'display' : ''}`}>
                                    <Form
                                        form={firstForm}
                                        layout="vertical"
                                    >
                                        <Form.Item
                                            name="name"
                                            label="Name"
                                            required
                                            rules={[{required: true, message: "Your name is required"}]}
                                        >
                                            <Input placeholder="Name" size="large" />
                                        </Form.Item>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            required
                                            rules={[{required: true, message: "Your email is required"}]}
                                        >
                                            <Input placeholder="Email" size="large" />
                                        </Form.Item>
                                        <Form.Item
                                            name="phone"
                                            label="Phone number"
                                            required
                                            rules={[{required: true, message: "Your phone number is required"}]}
                                        >
                                            <Input placeholder="Phone Number" size="large" />
                                        </Form.Item>

                                        <Form.Item
                                            name="age"
                                            label="Age"
                                            required
                                            rules={[{required: true, message: "Your age is required"}]}
                                        >
                                            <Input placeholder="Age" size="large" />
                                        </Form.Item>
                                    </Form>
                                </div>

                                <div className={`form__step ${stepIndex === 1 ? 'display' : ''}`}>
                                    <Form
                                        form={secondForm}
                                        layout="vertical"
                                    >
                                        <Form.Item
                                            name="occupation"
                                            label="Occupation"
                                            // required
                                            // rules={[{required: true, message: "Your occupation is required"}]}
                                        >
                                            <Input placeholder="Occupation" />
                                        </Form.Item>
                                        <Form.Item
                                            name="country"
                                            label="Country"
                                            required
                                            rules={[{required: true, message: "Your country is required"}]}
                                        >
                                            <Input placeholder="Country" />
                                        </Form.Item>
                                        <Form.Item
                                            name="hearAboutLenora"
                                            label="How Did you hear about Lenora?"
                                            required
                                            rules={[{required: true, message: "Your answer is required"}]}
                                        >
                                            <Input.TextArea placeholder="Your answer" />
                                        </Form.Item>
                                        <Form.Item
                                            name="appointmentExpectation"
                                            label="What are you hoping to accomplish through your upcoming appointment with Lenora?"
                                            required
                                            rules={[{required: true, message: "Your answer is required"}]}
                                        >
                                            <Input.TextArea placeholder="Your answer" />
                                        </Form.Item>
                                    </Form>
                                </div>

                                <div className="action py-4 flex justify-between">
                                    <div className="left">
                                        {
                                            stepIndex > 0 ?
                                                <button  type={'button'} onClick={() => nextStep('PREV')} className="btn-outlined">
                                                    <ArrowLeftOutlined />&nbsp;PREV
                                                </button> : null
                                        }
                                    </div>
                                    <div className="right">
                                        {
                                            !loading ?
                                                <button type="button" onClick={() => nextStep('NEXT')} className="btn-fill">
                                                    {
                                                        stepIndex > 0 ?
                                                            <span>SUBMIT</span> : <span>NEXT&nbsp;<ArrowRightOutlined /></span>
                                                    }
                                                </button> :
                                                <button className="btn-fill" disabled>SUBMITTING...</button>
                                        }
                                    </div>
                                </div>
                            </div>) : (
                            <div className="success-message flex flex-col justify-center align-items-center">
                                <img src="/images/thank-you.svg" style={{height: 200}} alt=""/>
                                <h1 className="text-2xl text-theme-primary font-bold mb-0 mt-4">Thank you for your time!</h1>
                                <p className="">You shall be contacted shortly by our Team</p>
                            </div>
                        )
                    }
                </div>
            </section>
            <FooterComponent/>
        </>
    );
}

export default BookSession;
