import React, {useEffect, useState} from 'react';
import SeoTags from "../../../components/seo-tags";
import AdminNav from "../../../components/admin-nav";
import {dbService} from "../../../firebase/db-service";
import {Avatar, Button, Input, List, message, Modal} from "antd";
import {formatDate} from "../../../utils/date.utils";
import {UserOutlined} from "@ant-design/icons/lib";
import dynamic from "next/dynamic";
import axios from "axios";

const Editor = dynamic(
    () => import("../../../components/editor"),
    { ssr: false }
);

function BookingsHome({bookings}) {
    const [sessions, setSessions] = useState([]);
    const [detailVisible, setDetailVisible] = useState(false);
    const [approvalVisible, setApprovalVisible] = useState(false);
    const [isSendingMsg, setIsSendingMsg] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messageForm, setMessageForm] = useState({
        subject: '',
        message: ''
    });

    useEffect(() => {
        setSessions(bookings);
        console.log(bookings);
    }, []);


    function sendMessage() {
        if (!messageForm.subject) {
            message.warn('Please enter message subject');
            return;
        }
        if (!messageForm.message) {
            message.warn('Please enter message');
            return;
        }
        // send message
        setIsSendingMsg(true);
        axios.post('/api/send-mail', {to: selectedSession?.email, ...messageForm})
            .then(() => {
                setApprovalVisible(false);
                setDetailVisible(false);
                message.success("Message was sent successfully");
                // update
                const data = {...selectedSession, replied: true};
                dbService.updateBooking(data);
            })
            .catch(err => {
                console.log(err);
                message.error('There was an error sending message. Please try again later');
            })
            .finally(() => setIsSendingMsg(false));
    }

    return (
        <>
            <SeoTags title="Bookings" />
            <AdminNav>
                <section className="bg-white px-6 h-full md:px-10 py-6">
                    <h1 className="text-3xl font-bold">Bookings</h1>

                    <section className="py-6">
                        <List
                            size="large"
                            header={<div>Recent</div>}
                            rowKey={(item) => item.id}
                            dataSource={sessions}
                            renderItem={item => {
                                return (
                                    <List.Item>
                                        <div className="trail">
                                            <h1 className="font-bold m-0">{item.name}</h1>
                                            <p className="m-0">{item.age} years old</p>
                                            <p className="text-xs text-grey-400"><small>{formatDate(item.date)}</small></p>
                                        </div>
                                        <div className="actions">
                                            <Button onClick={() => {
                                                setSelectedSession(item);
                                                setDetailVisible(true);
                                            }} type="link">View</Button>
                                        </div>
                                    </List.Item>
                                )
                            }}
                        />
                    </section>
                </section>
            </AdminNav>

            <Modal
                title={`View booking request`}
                visible={detailVisible}
                width={650}
                onCancel={() => setDetailVisible(false)}
                footer={
                    <div className="flex justify-end">
                        <Button onClick={() => setApprovalVisible(true)} type="primary">Approve</Button>
                        <Button onClick={() => setDetailVisible(false)} type="default">close</Button>
                    </div>
                }
            >
                <div className="row">
                    <div className="col-sm-4">
                        <Avatar size={64} icon={<UserOutlined />} />
                        <div className="trail">
                            <h1 className="font-bold mt-4 text-xl mb-0">{selectedSession?.name}</h1>
                            <p className="m-0">{selectedSession?.email}</p>
                            <p className="mb-3">{selectedSession?.phone}</p>
                            <p className="m-0">{selectedSession?.age} years old</p>
                            <p className="m-0">{selectedSession?.occupation}</p>
                            <p className="m-0">{selectedSession?.country}</p>
                        </div>

                    </div>
                    <div className="col-sm-6">
                        <div className="line mb-4">
                            <h4 className="font-bold">How Did you hear about Lenora?</h4>
                            <p>{selectedSession?.hearAboutLenora}</p>
                        </div>
                        <div className="line">
                            <h4 className="font-bold">What are you hoping to accomplish through your upcoming appointment with Lenora?</h4>
                            <p>{selectedSession?.appointmentExpectation}</p>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                title={`Approve ${selectedSession?.name}'s request`}
                visible={approvalVisible}
                centered
                onCancel={() => setApprovalVisible(false)}
                width={600}
                footer={
                    <div className="flex justify-end">
                        <Button loading={isSendingMsg} onClick={sendMessage} type="primary">Send</Button>
                        <Button onClick={() => setApprovalVisible(false)} type="default">close</Button>
                    </div>
                }
            >
                <p>
                    Send an approval message to <strong>{selectedSession?.name}</strong>. This message can include images
                    posters or a link to a zoom meeting.
                </p>
                <p className="">The message will be sent to <strong>{selectedSession?.email}</strong></p>
                <div className="mt-6">
                    <div className="item mb-3">
                        <p className="mb-2 font-bold text-xs">Subject</p>
                        <Input
                            placeholder="Subject"
                            onChange={(e) => {
                                setMessageForm({...messageForm, subject: e.target.value});
                            }}
                        />
                    </div>
                    <Editor onEdit={(val) => {
                        setMessageForm({...messageForm, message: val});
                    }}/>
                </div>
            </Modal>
        </>
    )
}

export async function getStaticProps() {
    try {

        const bookings = await dbService.getBookings();

        return {
            props: {
                bookings
            }
        }

    } catch (e) {
        return {
            props: {
                bookings: []
            }
        }
    }
}

export default BookingsHome;
