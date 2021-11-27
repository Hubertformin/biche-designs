import React, {useEffect, useState} from 'react';
import AdminNav from "../../../components/admin-nav";
import Head from "next/head";
import {Button, List, message, PageHeader, Popconfirm, Space} from "antd";
import Link from "next/link";
import {dbService} from "../../../firebase/db-service";
import {CalendarOutlined} from "@ant-design/icons/lib";
import {formatDate} from "../../../utils/date.utils";
import {BlogPostModel} from "../../../models/blog.model";

export default function AdminBlogHome() {
    const [posts, setPosts] = useState<BlogPostModel[]>([]);

    useEffect(() => {
        if (posts.length === 0) {
            dbService.getBlogPosts()
                .then(posts => setPosts(posts));
        }
    }, []);

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    function onDelete(data: BlogPostModel) {
        message.info('Deleting...');
        dbService.deleteBlogPost(data.id)
            .then(() => {
                const _data = posts.filter(p => p.id !== data.id);
                setPosts([..._data]);
            })
            .catch(err => {
                console.error(err);
                message.error('Unable to delete this post');
            });
    }

    return(
        <>
            <Head>
                <title>Blog home - BICHE ADMIN</title>
            </Head>
            <AdminNav>
                <section className="admin-content items">
                    <div id="header">
                        <PageHeader
                            className="site-page-header-responsive"
                            title="Blog"
                            extra={[
                                <Link href="/admin/blog/create"><Button key="add_item" type="primary">+ create post</Button></Link>
                            ]}
                        >
                        </PageHeader>
                    </div>
                    <div id="page_body" className="px-6">
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={posts}
                            renderItem={item => (
                                <List.Item
                                    key={item.title}
                                    actions={[
                                        <IconText icon={CalendarOutlined} text={formatDate(item.dateAdded)} />,
                                        <Button type="link">Edit</Button>,
                                        <Popconfirm title="Are you sure？" onConfirm={() => onDelete(item)} okText="Yes" cancelText="No">
                                            <Button type="link" danger={true}>Delete</Button>
                                        </Popconfirm>
                                    ]}
                                    extra={
                                        <img
                                            width={272}
                                            alt="logo"
                                            src={item.thumbnails.medium}
                                        />
                                    }
                                >
                                    <List.Item.Meta
                                        title={<a className="font-bold text-lg" href={item.title}>{item.title}</a>}
                                    />
                                    <span dangerouslySetInnerHTML={{
                                        __html: item.content.slice(0, 300) + '...'
                                    }}>
                                    </span>
                                </List.Item>
                            )}
                        />
                    </div>
                </section>
            </AdminNav>
        </>
    );
}
