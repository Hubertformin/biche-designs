import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import SeoTags from "../components/seo-tags";
import Nav from "../components/nav";
import '../styles/JournalView.module.less'
import FooterComponent from "../components/footer";
import firebase from "../firebase/clientApp";

function JournalView() {
    const [images, setImages] = useState([]);

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

    /*useLayoutEffect(() => {
        const imgContent = document.querySelectorAll('.img-content-hover');

        function showImgContent(e) {
            for(var i = 0; i < imgContent.length; i++) {
                const x = e.pageX;
                const y = e.pageY;
                // @ts-ignore
                imgContent[i].style.transform = `translate3d(${x}px, ${y}px, 0)`;
            }
        }

        document.addEventListener('mousemove', showImgContent);
    }, []);*/

    return (
        <>
            <SeoTags title="BICHE'S Journal"/>
            <Nav/>
            <main className="md:pt-10">
                <div className="header py-6 mb-6">
                    <h1>BICHE'S JOURNAL</h1>
                </div>
                <section className="gallery">
                    <div className="container">
                        <div className="grid">
                            {
                                images.map((url, index) => {
                                    return(
                                        <div key={"img-card-" + index} className="column-xs-12 column-md-4">
                                            <figure key={"fig-" + index} className="img-container">
                                                <img className="journal-img" key={"img" + index} src={url} alt="" />
                                                {/*<figcaption className="img-content">
                                                    <h2 className="title">Smart Watch</h2>
                                                    <h3 className="category">Showcase</h3>
                                                </figcaption>
                                                <span className="img-content-hover">
                                                    <h2 className="title">Smart Watch</h2>
                                                    <h3 className="category">Showcase</h3>
                                                </span>*/}
                                            </figure>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </section>
            </main>
            <FooterComponent/>
        </>
    );
}

export default JournalView;
