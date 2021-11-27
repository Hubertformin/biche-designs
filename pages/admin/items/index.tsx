import React, {useEffect, useState} from "react";
import AdminNav from "../../../components/admin-nav";
import '../../../styles/ItemsView.module.less';
import Head from "next/head";
import {Avatar, Button, Input, Modal, notification, PageHeader, Popconfirm, Space, Table, Tag} from "antd";
import {formatCurrency} from "../../../utils/format-currency.util";
import {ItemModel} from "../../../models";
import {formatStockStatus} from "../../../utils/stock.utils";
import {deleteFirebaseImages} from "../../../utils";
import Link from "next/link";
import {dbService} from "../../../firebase/db-service";


export default function ItemsView() {

    const [items, setItems] = useState<ItemModel[]>([]);

    const [editCategory, setEditCategory] = useState(null);

    const [categories, setCategories] = useState([{id: 'ALL', name: 'All'}]);

    const [selectedCategory, setSelectedCategory] = useState('All');
    /*modal methods*/
    const [catModalVisible, setCatModalVisible] = useState(false);
    let [newCategoryName, setNewCategoryName] = useState('');
    // loading statuses
    const [isCatLoading, setIsCatLoading] = useState(false);

    useEffect(() => {
       if (items.length === 0) {
            dbService
                .getItems({limit: 25})
                .then(items => {
                    setItems(items);
                });

       }
       // get all categories
        if (categories.length === 1) {
            /*dbService
                .getCategories()
                .then(cats => {
                    setCategories([...categories, ...cats])
                });*/
        }
    }, []);

    function deleteItem(item: ItemModel) {
        dbService
            .deleteItem(item.id)
            .then(() => {
                // edit item list
                const _items = items.filter(it => it.id !== item.id);
                setItems(_items);
                // delete item's images from firebase storage
                deleteFirebaseImages(item.photos);
            })
            .catch(err => {
                notification.error({message: "Unable to delete item", description: err.message});
            })
    }

    const columns = [
        {
            title: '#',
            key: 'image-col',
            render: (text, record, index) => <Avatar key={"table-thumbs" + index} shape="square" size="large" src={record.thumbnails.small} />
        },
        {
            title: 'Name',
            key: 'name-col',
            render: (text, record, index) => <span key={"name-row-" + index}>{record.name}</span>,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (text, record, index) => <span key={"qty-row-" + index}>{record.quantity}</span>,
        },
        {
            title: 'Unit price',
            dataIndex: 'unitPrice',
            key: 'unitPrice-col',
            render: (text, record, index) => <span key={"u-price-" + index}>{formatCurrency(text)}</span>
        },
        {
            title: 'status',
            key: 'stockStatus',
            render: (text, record, index) => (
                <Tag key={"table-status-" + index} color={record.stockStatus === "IN_STOCK" ? "green" : (record.stockStatus === "LOW_STOCK"? "orange" : "red")}>
                    {formatStockStatus(record.stockStatus)}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action-key',
            render: (text, record, index) => (
                <Space key={"table-space-" + index} size="middle">
                    <Link key={"table-edit-" + index} href={"/admin/items/edit/" + record.id}>
                        <a key={"table-edit-btn-" + index}>Edit</a>
                    </Link>
                    <Popconfirm key={"table-pop-" + index} title="Are you sure？" okText="Yes" onConfirm={() => deleteItem(record)} cancelText="No">
                        <a key={"table-delete-" + index} className="text-red-500 hover:text-red-500">Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    function getItemsByCat(name: string) {
        setSelectedCategory(name);
        if (name === "All") {
            dbService
                .getItems({limit: 25})
                .then(items => {
                    setItems(items);
                });
        } else {
            dbService
                .getItemsByCategory(name)
                .then(items => {
                    setItems(items);
                });
        }
    }

    /*
    * Create new category
    * */
    function createCategory() {
        // adding to the database...
        if (!newCategoryName) {
            dbService.addCategory(newCategoryName)
                .then((cat) => {
                    setCatModalVisible(false);
                    // cat to array of categories
                    setCategories([...categories, {id: cat.id, name: newCategoryName}]);
                    setNewCategoryName('');
                }).finally(() => {
                setIsCatLoading(false);
            });
            console.log(newCategoryName);
        }
    }

    function updateCategory(category) {
        if (!newCategoryName) {
            dbService.updateCategory({id: category.id, name: newCategoryName}, category.name)
                .then(() => {
                    const cats = categories.map((cat) => {
                        if (cat.id === category.id) {
                            cat.name = newCategoryName
                        }
                        return cat;
                    });
                    setCategories([...cats]);
                }).catch(err => {
                    notification.error({message: "Unable to update category", description: err.message});
                }).finally(() => {
                setIsCatLoading(false);
            });
        }
    }

    function categoryAction() {
        // add db to database and show loaders
        setIsCatLoading(true);
        if (editCategory) {
            updateCategory(editCategory)
        } else {
            createCategory();
        }
    }

    return(
        <>
            <style jsx>{`
              .list-action {
                display: none;
                white-space: nowrap;
              }
              .list-container:hover .list-action {
                display: block;
              }
            `}</style>
            <Head>
                <title>Inventory - BICHE DESIGNS</title>
            </Head>
            <AdminNav>
                <section className="admin-content items">
                    <div id="header" className="mb-4 pt-6 md:px-10 px-3">
                        <PageHeader
                            style={{padding: 0}}
                            className="site-page-header-responsive"
                            title="Inventory"
                            extra={[
                                <Link href="/admin/items/add"><Button key="add_item" type="primary">+Add item</Button></Link>,
                                <Button key="add_cat" type="primary" onClick={() => setCatModalVisible(true)}>+ Add category</Button>,
                            ]}
                        >
                        </PageHeader>
                    </div>
                    <section id="page_body" className="row md:px-10 px-3 pb-6">
                        {/*<div className="col-sm-3 md:h-full">
                            <List
                                key="categories-list"
                                header={<div className="font-bold">Categories</div>}
                                dataSource={categories}
                                renderItem={
                                    item => <List.Item key={"cat-"+ item.name} className="cursor-pointer">
                                        <div key={"flex-" + item.name} className="list-container flex justify-between w-full">
                                            <span onClick={()  => getItemsByCat(item.name)} key={"cat-"+ item.name + "-span"} className={`${selectedCategory === item.name ? "text-theme-primary" : ""}`}>{item.name}</span>
                                            {item.name !== "All" ?
                                                <span className="list-action">
                                                <EditOutlined onClick={() => setEditCategory(item)} />&nbsp;&nbsp;
                                                    <DeleteOutlined />
                                            </span> : null}
                                        </div>
                                    </List.Item>}
                            />
                        </div>*/}
                        <div className="md:h-full">
                            {/*<h1 className="mb-3 text-lg">{selectedCategory}</h1>*/}
                            <Table key="items-table"
                                   columns={columns}
                                   dataSource={items}
                            />
                        </div>
                    </section>

                </section>
            </AdminNav>
            {/*modals*/}
            <Modal
                title={editCategory ? "Update category" : "Add Category"}
                visible={catModalVisible || editCategory}
                onOk={categoryAction}
                confirmLoading={isCatLoading}
                onCancel={() => {setCatModalVisible(false); setEditCategory(null)}}
            >
                <div className="row">
                    <div className="col-sm-3 text-center">
                        <img className="inline" src="https://img.icons8.com/fluent/96/000000/add-to-collection.png"/>
                    </div>
                    <div className="col-sm-9">
                        <h1 className="font-bold text-lg">Add category</h1>
                        <Input placeholder={editCategory ? editCategory.name : "Category name"} onChange={(e) => setNewCategoryName(e.target.value)} />
                        <p className="mt-4 text-xs">
                            A category is a collection of similar items (ex. sweaters, Jackets).
                            For better experience, it's easier for a user to find an item based on categories
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    )
}
