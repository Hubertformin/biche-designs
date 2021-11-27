import React from "react";
import Nav from "../components/nav";
import "../styles/Home.module.less"
import FooterComponent from "../components/footer";
import {formatCurrency} from "../utils/format-currency.util";
import {FacebookOutlined, InstagramOutlined} from "@ant-design/icons/lib";
import Link from "next/link";
import SeoTags from "../components/seo-tags";
import {dbService, itemsCollection} from "../firebase/db-service";
import {ItemModel} from "../models";
import {BlogPostModel} from "../models/blog.model";

function Home({items, articles}: {items: ItemModel[], articles: BlogPostModel[]}) {
  return (
    <>
        <SeoTags title="Welcome to BICHE Designs" />
        <Nav />
        <div id="page-body">
            <div className="head-banner" style={{backgroundImage: 'url("https://ik.imagekit.io/biche/v0/b/biche-designs.appspot.com/o/images%2F2020-09-15-124527428.jpg?alt=media&token=4e4493b2-4613-4aad-a1db-024c62217579")'}}>
                <div className="circle"></div>
                <div className="wrapper">
                    <div className="text">
                        <h1 className="slogan">WELCOME</h1>
                        <h4 className="sample-text">WE&nbsp;&nbsp;CREATE&nbsp;&nbsp;TO&nbsp;&nbsp;EDUCATE</h4>
                    </div>
                </div>
            </div>
            <div className="brand-banner py-10">
                <h1 className="title">BICHE</h1>
                <h2 className="subtitle">D E S I G N S</h2>
            </div>
            <div className="about-banner" style={{backgroundImage: "url(https://ik.imagekit.io/biche/v0/b/biche-designs.appspot.com/o/images%2Fabout-banner.jpg?alt=media&token=7456e12d-d0cb-4c59-8c6e-96b6e980159e)"}}>
                <div className="wrapper">
                    <div className="text">
                        <h1 className="title text-xl md:text-4xl mb-0 text-left">This is BICHE..</h1>
                        <div className="title-border bg-theme-primary rounded-lg"></div>
                    </div>
                    <p className="desc text-lg px-6 md:px-24 xl:px-64 text-center">
                        Biche creates contemporary clothing with a touch of African print fabric. Unlike other clothing
                        brands we provide simplistic, ready to wear, fashion and lifestyle designs with African cultural
                        influence, while enhancing comfort, functionality and confidence for our customers.
                        At Bichedesigns, we aspire to develop new trends where customer satisfaction with clothing is
                        based on core personal and cultural values. BICHE will merge fashion and culture to create a wide
                        range of exclusive, smart and contemporary items.
                        BICHE focuses on inspiring fashionable  and culturally conscious individuals to dress up with
                        more confidence, colour  and grace.
                    </p>
                </div>
            </div>

            <div className="quote-banner px-6 md:px-24 py-5 bg-black">
                <div className="blockquote-wrapper">
                    <div className="blockquote">
                        <h1>
                            “I want to educate the world through fashion and creativity, I want to empower young people to
                            express their personal and cultural pride to through fashion and confident personal style”
                        </h1>
                        <h4>&mdash;Lenora Biche</h4>
                    </div>
                </div>
            </div>

            <div className="collection-banner px-6 py-5">
                <div className="text px-4 mb-6 md:mb-0">
                    <p className="text-lg font-bold">BICHE'S collection</p>
                    <div className="description">
                        Discover items that suit your style from our collection.
                    </div>
                    <Link href="/shop">
                        <button className="btn-fill">Start shopping</button>
                    </Link>
                </div>
                <div className="items-cards-container md:pl-16">
                    <div className="item-card">
                        <div className="image-container cursor-pointer bg-gray-100">
                            <Link href={`/shop/${items[0]?.id}`}>
                                <img src={items[0]?.thumbnails.medium} alt=""/>
                            </Link>
                        </div>
                        <Link href={`/shop/${items[0]?.id}`}>
                            <h1 className="title">{items[0]?.name}</h1>
                        </Link>
                        <div className="price">
                            {/*<span className="discount">{formatCurrency(250)}</span>*/}
                            <span className="actual">{formatCurrency(items[0]?.unitPrice)}</span>
                        </div>
                    </div>
                    <div className="item-card">
                        <div className="image-container cursor-pointer bg-gray-100">
                            <Link href={`/shop/${items[1]?.id}`}>
                                <img src={items[1]?.thumbnails.medium} alt=""/>
                            </Link>
                        </div>
                        <Link href={`/shop/${items[1]?.id}`}>
                            <h1 className="title cursor-pointer">{items[1]?.name}</h1>
                        </Link>
                        <div className="price">
                            {/*<span className="discount">{formatCurrency(250)}</span>*/}
                            <span className="actual">{formatCurrency(items[1]?.unitPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="book-banner" style={{backgroundImage: "url(https://ik.imagekit.io/biche/v0/b/biche-designs.appspot.com/o/images%2Fbook-banner.JPG?alt=media&token=5a7f857a-7a3b-4305-b4f8-9bab9d759cda)"}}>
                <div className="wrapper">
                    <h1 className="title text-2xl">Do you want a personal stylist?</h1>
                    <div className="title-border bg-theme-primary rounded-lg w-64"></div>
                    <div className="desc px-6 md:px-24 py-6">
                        <p>
                            Schedule a session with Lenora’s confident closet.
                            Lenora, a style and confidence coach who works with influential people to
                        </p>
                        <ul className="pl-6 list">
                            <li>Reinforce their confidence</li>
                            <li>Build branded personal style that is unique to them</li>
                            <li>Create clutter free spaces.</li>
                            <li>Construct and makeover closets</li>
                            <li>Style for special events and occasions</li>
                        </ul>
                    </div>
                    <a href="https://calendly.com/lenorasconfidentcloset/strategy-session" target="_blank">
                        <button className="btn-outlined white">Book Now</button>
                    </a>

                </div>
            </div>

            <div className="blog-banner px-6 md:px-20 md:pt-16 pb-10 py-6">
                <div className="social-links mb-8">
                    <div>
                        <a href="https://instagram.com/bichedesigns" target="_blank" className="icon"><InstagramOutlined />&nbsp;<span className="inline-on-md">Instagram</span></a>
                        <a href="https://www.facebook.com/BICHE-111714260421251" target="_blank" className="icon"><FacebookOutlined />&nbsp;<span className="inline-on-md">Facebook</span></a>
                        {/*<a href="/" target="_blank" className="icon"><TwitterOutlined />&nbsp;<span className="inline-on-md">Twitter</span></a>*/}
                    </div>
                </div>
                <div className="article-body">
                    {
                        articles[0]? <div className="article-cards">
                            <div className="preview" style={{backgroundImage: `url(${articles[0]?.thumbnails.medium})`}}>
                                <div className="wrapper">
                                    <div className="text">
                                        <h1 className="title">{articles[0]?.title}</h1>
                                        <Link href={`/blog/${articles[0]?.id}`}>
                                            <button className="btn-outlined white">Read more</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }
                    {
                        articles[1]? <div className="article-cards">
                            <div className="preview" style={{backgroundImage: `url(${articles[1]?.thumbnails.medium})`}}>
                                <div className="wrapper">
                                    <div className="text">
                                        <h1 className="title">{articles[1]?.title}</h1>
                                        <Link href={`/blog/${articles[1]?.id}`}>
                                            <button className="btn-outlined white">Read more</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }
                    {
                        articles[2]? <div className="article-cards">
                            <div className="preview" style={{backgroundImage: `url(${articles[2]?.thumbnails.medium})`}}>
                                <div className="wrapper">
                                    <div className="text">
                                        <h1 className="title">{articles[2]?.title}</h1>
                                        <Link href={`/blog/${articles[2]?.id}`}>
                                            <button className="btn-outlined white">Read more</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }
                    {
                        articles[3]? <div className="article-cards">
                            <div className="preview" style={{backgroundImage: `url(${articles[3]?.thumbnails.medium})`}}>
                                <div className="wrapper">
                                    <div className="text">
                                        <h1 className="title">{articles[3]?.title}</h1>
                                        <Link href={`/blog/${articles[3]?.id}`}>
                                            <button className="btn-outlined white">Read more</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="preview" style={{backgroundImage: `url(${articles[4]?.thumbnails.medium})`}}>
                                <div className="wrapper">
                                    <div className="text">
                                        <h1 className="title">{articles[4]?.title}</h1>
                                        <Link href={`/blog/${articles[4]?.id}`}>
                                            <button className="btn-outlined white">Read more</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }
                </div>
            </div>
            <FooterComponent/>
        </div>
    </>
  )
}

export async function getStaticProps() {
    try {
        const items = await itemsCollection.orderBy('name', 'asc').limit(2).get().then(query => query.docs.map(doc => {
            const id = doc.id;
            const data = doc.data();
            return {id, ...data};
        }));

        const _articles = await dbService.getBlogPosts(4);
        const articles: any[] = (_articles as any[]).map(a => {
            a.dateAdded = a.dateAdded.getTime();
            // a.dateAdded = new Date(a.dateAdded).getTime();
            return a;
        });
        return {
            props: {items, articles}
        }
    } catch (e) {
        return {
            props: {items: [], articles: []}
        }
    }
}

export default Home;
