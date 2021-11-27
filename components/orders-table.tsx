import React, {useState} from 'react';
import {Table} from "antd";
import {formatCurrency} from "../utils/format-currency.util";
import {formatDate} from "../utils/date.utils";
import {CheckCircleFilled, ClockCircleOutlined} from "@ant-design/icons/lib";
import Link from "next/link";
import {ColumnsType} from "antd/es/table";
import {PaymentModel} from "../models/payment.model";

function OrdersTable({data}) {
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState( {
        current: 1,
        pageSize: 15,
        total: 45
    });
    const columns: ColumnsType<PaymentModel> = [
        {
            title: 'INV',
            dataIndex: 'invoiceNumber',
            sorter: (a, b) => a.invoiceNumber.length - b.invoiceNumber.length,
            render: (inv) => (<strong>#{inv}</strong>),
            width: '15%',
        },
        {
            title: 'Customer',
            dataIndex: 'user',
            render: user => (<><h4 style={{marginBottom: 0}}>{user.name}</h4> <span style={{color: '#999'}}>{user.email}</span></>)
            // filters: [
            //     { text: 'Male', value: 'male' },
            //     { text: 'Female', value: 'female' },
            // ],
            // width: '20%',
        },
        {
            title: 'Status',
            dataIndex: 'paymentIntent',
            filters: [
                { text: 'Payed', value: 'succeeded' },
                { text: 'Pending', value: 'pending' },
            ],
            onFilter: (value, record) => record.paymentIntent.status === value,
            render: intent => intent.status === 'succeeded' ?
                (<small className="text-green-500 bg-green-100 px-1 py-2 rounded"><CheckCircleFilled /> Payed</small>) :
                (<small className="bg-gray-100 px-3 py-2 rounded"><ClockCircleOutlined /> Pending</small>)
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: (a, b) => a.amount - b.amount,
            render: amount => (<strong>{formatCurrency(amount)}</strong>)
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => a.date - b.date,
            render: date => (<span>{formatDate(date)}</span>)
        },
        {
            title: 'Action',
            dataIndex: 'id',
            render: id => (<Link href={`/admin/orders/${id}`}>View</Link>)
        }
    ];


    const handleTableChange = (pagination, filters, sorter) => {
       console.log(pagination, filters, sorter);
    };

    return (
        <>
            <Table
                columns={columns}
                rowKey={record => record.id}
                dataSource={data}
                // pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </>
    );
}

export default OrdersTable;
