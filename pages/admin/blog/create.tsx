import AdminNav from "../../../components/admin-nav";
import Head from "next/head";
import {Button, Input, message, notification, PageHeader, Progress} from "antd";
import React, {useRef, useState} from "react";
import dynamic from "next/dynamic";
import {FileAddOutlined} from "@ant-design/icons";
import firebase from "../../../firebase/clientApp";
import {renderBlogImage} from "../../../utils";
import {BlogPostModel} from "../../../models/blog.model";
import {imageKitTransformUrl} from "../../../utils/image-kit";
import {dbService} from "../../../firebase/db-service";

const Editor = dynamic(
    () => import("../../../components/editor"),
    { ssr: false }
);

export default function AdminBlogAdd() {
    const inputFileRef = useRef();

    const [importedImage, setImportedImage] = useState(null);
    const [postTitle, setPostTitle] = useState(null);
    const [postBody, setPostBody] = useState(null);
    const [isSaving, setIsSaving]= useState(false);
    const [uploadPercent, setUploadPercent]= useState(0);

    function onEditorChange(data) {
        setPostBody(data);
    }

    function importImage() {
        if (isSaving) {
            return;
        }
        // @ts-ignore
        inputFileRef.current.click();
    }

    function onImportImage(e) {
        const file = e.target.files[0];
        if (file) {
            setImportedImage(file);
        }
    }

    function uploadCoverImage(name: string) {
        return new Promise((resolve, reject) => {
            const uploadTask = firebase.storage().ref(`images/blog-post-${name}`).put(importedImage);
            uploadTask.on("state_changed", (snapshot) => {
                setUploadPercent((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            }, (error) => reject(error),
                () => {
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(url => {
                        resolve(url.toString().replace("https://firebasestorage.googleapis.com","https://ik.imagekit.io/biche"));
                    })
                    .catch(err => reject(err));
            });
        });
    }

    function savePost() {
        if (!postTitle) {
            message.warn("Please specify the post's title");
            return;
        }
        if (!postBody) {
            message.warn("Please specify the post's content");
            return;
        }
        // init post body
        const post: BlogPostModel = {
            title: postTitle,
            content: postBody,
            dateAdded: new Date()
        };
        // show loaders
        setIsSaving(true);
        // uploading image
        uploadCoverImage(postTitle)
            .then((url: string) => {
                post.coverImageURL = url;
                post.thumbnails = {
                    large: imageKitTransformUrl({url, height: 845, width: 1550}),
                    medium: imageKitTransformUrl({url, height: 500, width: 984}),
                    small: imageKitTransformUrl({url, height: 250, width: 452.1}),
                };
                // add to db
                dbService
                    .addBlogPost(post)
                    .then(() => {
                        // reset forms
                        setPostTitle('');
                        setPostBody('');
                        setImportedImage('');
                        setUploadPercent(0);
                    })
                    .catch((err) => {
                        console.error(err);
                        notification.error({message: "Unable to upload cover image", description: err.message});
                    })
                    .finally(() => setIsSaving(false));
            }).catch((err) => {
                console.error(err);
                notification.error({message: "Unable to upload cover image", description: err.message});
        })
            // .finally(() => setIsSaving(false));
    }

    return (
        <>
            <Head>
                <title>Create blog post - BICHE ADMIN</title>
            </Head>
            <style jsx>{`
               .image-container {
                 height: 197px;
                 position: relative;
                 overflow: hidden;
               }
               .image-container img {
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  object-fit: cover;
                }
                .image-container img:hover + .hover-bg {
                   visibility: visible;
                }
                .image-container .hover-bg {
                  visibility: hidden;
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  color: white;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  background-color: rgba(0, 0, 0, 0.8);
                }
             `}
            </style>
            <AdminNav>
                <section className="admin-content">
                    <div id="header">
                        <PageHeader
                            className="site-page-header-responsive"
                            title="Create blog post"
                            extra={[
                                <Button key="add_item" loading={isSaving} onClick={savePost} type="primary">Save</Button>
                            ]}
                        >
                        </PageHeader>
                    </div>
                    <section id="page_body" className="pl-10 pt-3 pr-16">
                        <input ref={inputFileRef} type="file" accept="images/*" onChange={onImportImage} style={{display: "none"}}/>
                        <div onClick={importImage} className="image-container bg-gray-200 cursor-pointer hover:bg-gray-300 mb-6 flex rounded flex-col justify-center align-item-center">
                            {importedImage ?
                                <>
                                    <img src={renderBlogImage(importedImage)} alt="" />
                                    <div className="hover-bg">
                                        <FileAddOutlined className="text-xl" />
                                        <span>Click to import cover image</span>
                                    </div>
                                </> :
                            <>
                                <FileAddOutlined className="text-xl" />
                                <h1>Click to import cover image</h1>
                            </>}
                            {isSaving ?  <div className="px-16 w-full"><Progress percent={uploadPercent} /></div>: null}
                        </div>
                        <div className="">
                            <Input onChange={(e) => setPostTitle(e.target.value)} placeholder="Enter post title" />
                        </div>
                        <div className="mt-6">
                            <Editor onEdit={onEditorChange}/>
                        </div>
                    </section>
                </section>
            </AdminNav>
        </>
    )
}
