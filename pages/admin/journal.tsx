import React, {useEffect, useRef, useState} from 'react';
import SeoTags from "../../components/seo-tags";
import AdminNav from "../../components/admin-nav";
import '../../styles/JournalHome.module.less';
import {Button, message, Popconfirm, Progress} from "antd";
import firebase from "../../firebase/clientApp";
import {DeleteOutlined} from "@ant-design/icons/lib";

function JournalHome() {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [images, setImages] = useState([]);
    const inputFile = useRef();

    useEffect(() => {
        const listRef = firebase.storage().ref('gallery');
        // Find all the prefixes and items.
        listRef.listAll()
            .then(res => {
                const imagePromise = res.items.map((itemRef) => {
                    return itemRef.getDownloadURL();
                });
                Promise.all(imagePromise)
                    .then(urls => {
                        setImages(urls);
                    });
            });
    }, []);

    const calculateProgress = (percent: number, index: number, count: number) => {
        return (((100 * index) + percent) / count)
    };

    function imageUpload(e) {
        e.preventDefault(); // prevent page refreshing
        const promises = [];
        const files = [...e.target.files];
        files.forEach((file: any, index) => {
                const uploadTask =
                    firebase.storage().ref().child(`gallery/${file.name}`).put(file);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
                    setUploadProgress(((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
                    /*if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                        console.log(`Progress: ${progress}%`);
                    }*/
                    },
                        error => console.log(error.code),
                    async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    setImages([downloadURL, ...images]);
            }
        );
    });
        Promise.all(promises)
            .catch(err => {
                console.log(err.code);
                message.error('There was a problem uploading. Please try again later');
            });
    }

    function onFileSelect() {
        // @ts-ignore
        inputFile?.current?.click();
    }

    function deleteFile(img: any) {
        // when files are removed from list
        // console.log(file);
        firebase.storage().refFromURL(img)
            .delete()
            .then(() => {
                setImages(images.filter(f => f !== img))
            })
            .catch(err => console.error(err));
    }

    return (
        <>
            <SeoTags title="Journal" />
            <AdminNav>
                <section className="h-full bg-white py-6 px-6 md:px-10 overflow-y-auto">
                    <div className="header mb-6">
                        <div className="lead">
                            <h1 className="text-xl m-0 font-bold">Journal</h1>
                        </div>
                        <div className="progress px-6 md:px-16">
                            {
                                uploadProgress > 0 ? <Progress percent={uploadProgress} /> : null
                            }
                        </div>
                        <div className="action">
                            <input ref={inputFile} accept="images/*" multiple onChange={imageUpload} type="file" style={{display: 'none'}} />
                            <Button type="primary" onClick={onFileSelect}>Upload</Button>
                        </div>
                    </div>
                    {
                        images.length > 0 ? images.map((img, index) => {
                            return(
                                <div className="gallery bg-grey-500 h-64 flex rounded">
                                    <div key={'g-imgc-' + index} className="image-container shadow px-3 py-3">
                                        <img key={'g-img-' + index} src={img} className="img-gallery" />
                                        <div className="action text-right">
                                            <Popconfirm
                                                title="Are you sure to delete this file?"
                                                onConfirm={() => deleteFile(img)}
                                                onCancel={() => {}}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <button className="text-red-500">
                                                    <DeleteOutlined />
                                                </button>
                                            </Popconfirm>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) :
                            <section className="empty bg-grey-500 flex flex-col justify-center align-item-center">
                                <img src="/images/addphoto.png" alt=""/>
                                <h1 className="font-bold text-xl">There is nothing here...</h1>
                                <p>Upload images to your gallery (Journal)</p>
                                <Button type="primary" onClick={onFileSelect}>Upload</Button>
                            </section>
                        }
                </section>
            </AdminNav>
        </>
    )
}

export default JournalHome;
