import React from "react";
import AdminNav from "../../../components/admin-nav";
import Head from "next/head";
import '../../../styles/AdminOrderDetail.module.less';
import {CheckCircleFilled, ClockCircleOutlined, ArrowLeftOutlined} from "@ant-design/icons/lib";
import {formatCurrency} from "../../../utils/format-currency.util";
import {paymentCollection} from "../../../firebase/db-service";
import {PaymentModel} from "../../../models/payment.model";
import {formatDate} from "../../../utils/date.utils";
import {Button} from "antd";
import Link from "next/link";

function OrderDetail({order}: {order: PaymentModel}) {
    // console.log(order);
    const card = order.paymentIntent.charges?.data[0].payment_method_details.card;
    return(
        <>
            <Head>
                <title>Invoice #{order.invoiceNumber} - BICHE DESIGNS Admin</title>
            </Head>
            <AdminNav>
                <section className="h-full w-full pb-24">
                    <div className="action pb-6">
                        <Link href="/admin/orders">
                            <Button type="link"><ArrowLeftOutlined />&nbsp;Back</Button>
                        </Link>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="details-panel px-4 py-6 w-full h-full bg-white rounded-lg">
                                <h1 className="inv-number">Invoice #{order.invoiceNumber}</h1>
                                <div className="date-section pt-3 border-t mt-4">
                                    <small>Date</small>
                                    <p>{formatDate(order.date)}</p>
                                </div>
                                <div className="user-section py-3 mt-4 border-t">
                                    <div className="line">
                                        <span className="label">Name</span>
                                        <p>{order.user.name}</p>
                                    </div>
                                    <div className="line">
                                        <span className="label">Email</span>
                                        <p>{order.user.email}</p>
                                    </div>
                                    <div className="line">
                                        <span className="label">Phone number</span>
                                        <p>+39 {order.user.phone}</p>
                                    </div>
                                    <div className="line">
                                        <span className="label">Address</span>
                                        <p className="mb-0">{order.user.address.line1}</p>
                                        <p className="mb-0">{order.user.address.city}</p>
                                        <p className="mb-0">{order.user.address.state}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="orders-panel px-4 py-6 w-full bg-white rounded-lg">
                                <div className="price">
                                    <span className="label">Total Amount</span>
                                    <h1 className="amount">{formatCurrency(order.amount)}</h1>
                                </div>
                                <div className="status border-t mt-4 py-4">
                                    <span className="label">Payment details</span>
                                    <p><img src={`/images/${card?.brand}.svg`} style={{height: 40, display: 'inline'}} alt=""/>&nbsp;&nbsp; {card ? `**** **** **** ${card?.last4}` : ''}</p>
                                    {/*<span>Payment status:</span>&nbsp;*/}
                                    {order.paymentIntent.status === 'succeeded' ?
                                        (<p className="text-green-500 inline bg-green-100 px-1 py-2 rounded"><CheckCircleFilled /> Payed</p>) :
                                        (<p className="bg-gray-100 px-3 py-2 inline rounded"><ClockCircleOutlined /> Pending</p>)}
                                </div>
                                <div className="items border-t mt-4 pt-4">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Qty</th>
                                            <th>Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            order.items.map(item => {
                                                return(
                                                    <tr key={"t-row-" + item.id}>
                                                        <td key={"t-row-img-td-" + item.id}>
                                                            <img key={"t-row-img" + item.id} src={item.thumbnails.small} alt=""/>
                                                        </td>
                                                        <td key={"t-row-name-" + item.id}>{item.name}</td>
                                                        <td key={"t-row-qty-" + item.id}>{item.quantity}</td>
                                                        <td key={"t-row-amount-" + item.id}>{formatCurrency(item.quantity * item.unitPrice)}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <th/>
                                            <th>Total</th>
                                            <th/>
                                            <th>{formatCurrency(order.amount)}</th>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="device-panel mt-4 px-4 py-6 w-full bg-white rounded-lg">
                                <h4>User's device information</h4>
                                <div className="row">
                                    <div className="line col-sm-4">
                                        <span className="label">Device</span>
                                        <p>{order.userAgent.deviceType ?? order.userAgent.os}</p>
                                    </div>
                                    <div className="line col-sm-4">
                                        <span className="label">Os</span>
                                        <p>{`${order.userAgent.os} ${order.userAgent.osVersion}`}</p>
                                    </div>
                                    <div className="line col-sm-4">
                                        <span className="label">Browser</span>
                                        <p>{`${order.userAgent.browser}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </AdminNav>
        </>
    );
}

OrderDetail.getInitialProps = async (ctx) => {
    // console.log(ctx);
    try {
        const obj = await paymentCollection.doc(ctx.query.id).get().then(payload => {
            return {id: payload.id, ...payload.data()};
        });
        return {order: obj};
    } catch (err) {
        return {order: null}
    }
};

export default OrderDetail;
