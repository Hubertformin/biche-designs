import React, {useEffect, useState} from "react";
import AdminNav from "../../../components/admin-nav";
import Head from "next/head";
import {
    Button,
    Input,
    List, message,
    Modal,
    notification,
    PageHeader, Popconfirm,
    Skeleton,
} from "antd";
import {dbService} from "../../../firebase/db-service";

function CategoriesAdmin() {
    const [catModalVisible, setCatModalVisible] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [categories, setCategories] = useState([{id: 'ALL', name: 'All'}]);
    let [newCategoryName, setNewCategoryName] = useState('');
    // loading statuses
    const [isCatLoading, setIsCatLoading] = useState(false);

    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const onLoadMore = () => {

    }

    const loadMore =
        !initLoading && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;


    useEffect(() => {
        if (categories.length === 1) {
            dbService
                .getCategories()
                .then(cats => {
                    setCategories([...categories, ...cats]);
                    setLoading(false);
                }).catch(err => message.error("There was an error loading categories"))
        }
    }, []);

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
                    setEditCategory(null);
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

    function deleteCategory(id) {
        dbService.deleteCategory(id)
            .then(() => {
                const _cats = categories.filter(ct => ct.id !== id);
                setCategories(_cats);
            })
            .catch(err => {
                console.error(err);
                message.error("There was an error deleting this category, please try again later");
            });
    }

    function toggleUpdate(item: any) {
        setEditCategory(item);
        // show modal
        setCatModalVisible(true);
    }

    return (
        <>
            <Head>
                <title>Categories - BICHE DESIGNS</title>
            </Head>
            <AdminNav>
                <section className="admin-content items">
                    <div id="header" className="mb-4 pt-6 md:px-10 px-3">
                        <PageHeader
                            style={{padding: 0}}
                            className="site-page-header-responsive"
                            title="Inventory categories"
                            extra={[
                                <Button key="add_cat" type="primary" onClick={() => setCatModalVisible(true)}>+ Add category</Button>,
                            ]}
                        >
                        </PageHeader>
                    </div>
                    <section id="page_body" className="row md:px-16 px-3 pb-6 xl:px-24">
                        <List
                            className="demo-loadmore-list"
                            loading={initLoading}
                            itemLayout="horizontal"
                            loadMore={loadMore}
                            dataSource={categories}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Button type="link" onClick={() => toggleUpdate(item)}>Edit</Button>,
                                        <Popconfirm title="Are you sure？" onConfirm={() => deleteCategory(item.id)} okText="Yes" cancelText="No">
                                            <Button type="link" danger>Delete</Button>
                                        </Popconfirm>
                                    ]}
                                >
                                    <Skeleton loading={loading} active>
                                        <List.Item.Meta
                                            title={<a href="https://ant.design">{item.name}</a>}
                                        />
                                    </Skeleton>
                                </List.Item>)}
                            />
                    </section>
                </section>
            </AdminNav>
            {/*modals*/}
            <Modal
                title={editCategory ? "Update category" : "Add Category"}
                visible={catModalVisible}
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
    );
}

export default CategoriesAdmin;
