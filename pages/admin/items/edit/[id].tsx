import React, {useEffect, useState} from 'react';
import {dbService} from "../../../../firebase/db-service";
import AdminNav from "../../../../components/admin-nav";
import {Button, Checkbox, Divider, Form, Input, InputNumber, message, Modal, notification, Select} from "antd";
import {ItemModel} from "../../../../models";
import {imageKitTransformUrl} from "../../../../utils/image-kit";
import Head from "next/head";
import ImageUploadWall from "../../../../components/image-upload-wall";
import {PlusOutlined} from "@ant-design/icons/lib";

export default function UpdateItem({ selectedItem }) {
    // intialize vars
    const [form] = Form.useForm();
    const [checkPreOrder, setCheckPreOrder] = useState(false);
    const [categories, setCategories] = useState([]);
    const [clearImagesStatus, setClearImagesStatus] = useState(false);
    // loading status
    const [isAddItem, setIsAddItem] = useState(false);
    /*modal methods*/
    const [catModalVisible, setCatModalVisible] = useState(false);
    let [newCategoryName, setNewCategoryName] = useState('');
    // loading statuses
    const [isCatLoading, setIsCatLoading] = useState(false);

    const showModal = () => {
        setCatModalVisible(true);
    };
    /*
    * Create new category
    * */
    const createCategory = e => {
        // add db to database and show loaders
        setIsCatLoading(true);
        // adding to the database...
        dbService.addCategory(newCategoryName)
            .then(() => {
                setCatModalVisible(false);
                // cat to array of categories
                setCategories([...categories, {name: newCategoryName}]);
                // set it
                form.setFields([{name: "category", value: newCategoryName}]);
            }).finally(() => {
            setIsCatLoading(false);
        });
        console.log(newCategoryName);
    };
    /*
    * When new category name is set
    * */
    const onNewCategoryName = e => {
        setNewCategoryName(e.target.value);
    };
    /*
    * When the modal is closed
    * */
    const handleCancel = e => {
        setCatModalVisible(false);
    };
    /*
    * User effect hook
    * */
    useEffect(() => {
        if (categories.length === 0) {
            dbService
                .getCategories()
                .then(data => {
                    setCategories(data);
                });
        }
    });
    /*
    * Item object
    * */
    const item: ItemModel = {
        id: selectedItem.id,
        stockStatus: "IN_STOCK",
        photos: [...selectedItem.photos],
        thumbnails: selectedItem.thumbnails
    };

    useEffect(() => {
        if (!form.isFieldsTouched(true)) {
            const initialFormVals = Object.keys(selectedItem).map(key =>  {return {name: key, value: selectedItem[key]}});
            form.setFields(initialFormVals);
        }
    }, []);

    const onCheckboxChange = e => {
        setCheckPreOrder(e.target.checked);
    };
    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    function updateItemInDB(data) {
        // set image clear status to false, so the image wall can be used again
        setClearImagesStatus(false);
        // passing data....
        item.name = data.name;
        item.quantity = data.quantity;
        item.unitPrice = data.unitPrice;
        item.orderState = checkPreOrder ? "PRE_ORDER" : "ORDER";
        item.category = data.category;
        item.lowStockLevel = data.lowStockLevel ? data.lowStockLevel : 5;
        item.colors = data.colors ? data.colors.toString().trim().split(",") : [];
        item.sizes = data.sizes ? data.sizes.toString().trim().split(",") : [];
        // check for images
        if (item.photos.length === 0) {
            message.warn("Please upload at least one photo");
            return;
        }
        // show loader
        setIsAddItem(true);
        // add item to db
        dbService
            .updateItem(item)
            .then(() => {
                // reset form
                notification.success({message: "The item was updated", placement: "topRight"});
            }).catch(err => {
            console.error(err);
            notification.error({message: "Opps! Unable to update this item", description: err.message});
        }).finally(() => setIsAddItem(false));
    }

    function onFileUpload(url) {
        // console.log(url); // url
        if (!item.thumbnails?.small && !item.thumbnails?.medium && !item.thumbnails?.large) {
            item.thumbnails = {
                large: imageKitTransformUrl({url, height: 500, width: 500}),
                medium: imageKitTransformUrl({url, height: 250, width: 250}),
                small: imageKitTransformUrl({url, height: 100, width: 100}),
            }
        }
        // add to array of photos
        item.photos.push(url);

    }

    return(
        <>
            <Head>
                <title>Edit {selectedItem.name} - BICHE ADMIN</title>
            </Head>
            <AdminNav>
                <section className="admin-content px-10 pt-6">
                    <div className="row h-full">
                        <div className="col-sm-7 border-r h-full overflow-y-auto">
                            <h1 className="text-xl font-bold">Basic Info</h1>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={updateItemInDB}
                                scrollToFirstError={true}
                            >
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Form.Item
                                            name="name"
                                            label="Name"
                                            hasFeedback
                                            rules={[{ required: true, message: "The item's name is required!" }]}
                                        >
                                            <Input placeholder="Item's name" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-sm-6">
                                        <Form.Item
                                            required
                                            name="unitPrice"
                                            label="Unit price"
                                            hasFeedback
                                            rules={[{ required: true, message: 'Please specify the selling price' }]}
                                            tooltip={{ title: 'The item\'s selling price' }}
                                        >
                                            <InputNumber
                                                min={1}
                                                className="w-full"
                                                placeholder="Unit price"
                                                formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\€\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Form.Item
                                            required
                                            name="quantity"
                                            hasFeedback
                                            label="Opening stock (Quantity)"
                                            rules={[{ required: !checkPreOrder, message: 'Please specify the opening stock' }]}
                                            tooltip={{ title: "The quantity available for sale" }}
                                        >
                                            <InputNumber
                                                min={1}
                                                placeholder="Quantity"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="preOrder"
                                            tooltip={{ title: "If checked, this item will be available only for pre-orders" }}
                                        >
                                            <Checkbox checked={checkPreOrder} onChange={onCheckboxChange}
                                            >
                                                Mark for pre-order
                                            </Checkbox>
                                        </Form.Item>
                                    </div>
                                    <div className="col-sm-6">
                                        <Form.Item
                                            label="Category"
                                            name="category"
                                            required
                                            tooltip={{title: "By setting a category, you are adding this item to a collection of similar items"}}
                                        >
                                            <Select
                                                placeholder="Item category"
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                        <Divider style={{ margin: '4px 0' }} />
                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                            <a onClick={showModal}
                                                               style={{ flex: 'none', padding: '0 3px', display: 'block', cursor: 'pointer' }}
                                                            >
                                                                <PlusOutlined /> Add category
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            >
                                                {
                                                    categories.map((cat, index) => {
                                                        return <Select.Option key={"cat-op-" + index} value={cat.name}>{cat.name}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="col-sm-6">
                                        <Form.Item
                                            name="lowStockLevel"
                                            label="Low stock level"
                                            tooltip={{ title: "You can specify at what quantity level this item would be flagged as low stock. The default is 5"}}
                                        >
                                            <InputNumber
                                                min={1}
                                                placeholder="Low stock level (Default is 5)"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                                <Form.Item
                                    label="Color variants"
                                    name="colors"
                                    tooltip={{ title: "You can choose to specify comma separated color variants. ex: Red,green,blue"}}
                                >
                                    <Input placeholder="Color variants (e.g Red,Green, Blue)">

                                    </Input>
                                </Form.Item>
                                <Form.Item
                                    label="Size variants"
                                    name="sizes"
                                    tooltip={{ title: "You can choose to specify comma separated size variants. ex: XL,M"}}
                                >
                                    <Input placeholder="Size variants (e.g M, XL, XXL)">

                                    </Input>
                                </Form.Item>
                                <Form.Item className="text-right">
                                    {/*<button type="submit" className="btn-fill">Submit</button>*/}
                                    <Button loading={isAddItem} type="primary" htmlType="submit" key="submit">Save</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="col-sm-5">
                            <h1 className="text-xl font-bold mb-6">Photos</h1>
                            <ImageUploadWall max={4} images={selectedItem.photos} onUpload={onFileUpload} clearAll={clearImagesStatus}/>
                        </div>
                    </div>
                </section>
            </AdminNav>
            {/*modals*/}
            <Modal
                title="Add Category"
                visible={catModalVisible}
                onOk={createCategory}
                confirmLoading={isCatLoading}
                onCancel={handleCancel}
            >
                <div className="row">
                    <div className="col-sm-3 text-center">
                        <img className="inline" src="https://img.icons8.com/fluent/96/000000/add-to-collection.png"/>
                    </div>
                    <div className="col-sm-9">
                        <h1 className="font-bold text-lg">Add category</h1>
                        <Input placeholder="Category name" onChange={onNewCategoryName} />
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

UpdateItem.getInitialProps = async (ctx) => {
    // console.log(ctx);
    try {
        const item = await dbService.getItem(ctx.query.id);
        return {selectedItem: item};
    } catch (err) {
        return {selectedItem: null}
    }
};
