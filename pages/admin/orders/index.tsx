import React, {useState} from 'react';
import Head from "next/head";
import AdminNav from "../../../components/admin-nav";
import "../../../styles/AdminOrderDetail.module.less";
import {paymentCollection} from "../../../firebase/db-service";
import {PaymentModel} from "../../../models/payment.model";
import OrdersTable from "../../../components/orders-table";


function AdminOrders({payments}) {
    const [orders, setOrders] = useState<PaymentModel[]>(payments);

    return(
        <>
            <Head>
                <title>Orders - BICHE DESIGNS Admin</title>
            </Head>
            <AdminNav>
                <section>
                    <section className="bg-white px-4 py-8">
                        <div className="header">
                            <h1 className="text-xl mb-6 font-bold">Orders</h1>
                        </div>
                        <OrdersTable data={orders} />
                    </section>
                </section>
            </AdminNav>
        </>
    )
}

export async function getStaticProps() {
        try {
            const _payments = await paymentCollection.orderBy('date', "desc").limit(15).get();
            const payments = _payments.docs.map(od => {
                return {id: od.id, ...od.data()};
            });

            console.log(payments[0]);

            return {
                props: {
                    payments
                }
            }

        } catch (e) {
            console.error(e);
            return {
                props: {payments: []}
            }
        }
}


export default AdminOrders;
