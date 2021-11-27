import React from 'react';
import Nav from "../../components/nav";
import '../../styles/BlogDetail.module.less'
import SeoTags from "../../components/seo-tags";
import FooterComponent from "../../components/footer";
import {BlogPostModel} from "../../models/blog.model";
import {dbService} from "../../firebase/db-service";
import {formatDate} from "../../utils/date.utils";
import {FacebookShareButton, TwitterShareButton, WhatsappShareButton} from "react-share";
import {FacebookOutlined, TwitterOutlined, WhatsAppOutlined} from "@ant-design/icons/lib";

function BlogDetail({article}: {article: BlogPostModel}) {
    return(
        <>
            <SeoTags title={article?.title} imageUrl={article?.coverImageURL} description={article?.content.slice(0, 100)} />
            <Nav />
            <main>
                <div className="cover-image" style={{backgroundImage: `url(${article?.coverImageURL})`}}>
                </div>
                <div className="article-body mb-16">
                    <div className="article-meta">
                        <p className="date">Published on {formatDate(article?.dateAdded)}</p>
                        {
                            article ?
                                <div className="share">
                                    <small>Share</small>
                                    <FacebookShareButton url={`https://bichedesigns.com/blog/${article.id}`}>
                                        <span className="icon"><FacebookOutlined /></span>
                                    </FacebookShareButton>
                                    <TwitterShareButton url={`https://bichedesigns.com/blog/${article.id}`}>
                                        <span className="icon"><TwitterOutlined /></span>
                                    </TwitterShareButton>
                                    <WhatsappShareButton url={`https://bichedesigns.com/blog/${article.id}`}>
                                        <span className="icon"><WhatsAppOutlined /></span>
                                    </WhatsappShareButton>
                                </div> : null
                        }
                    </div>
                    <div className="text" dangerouslySetInnerHTML={{__html: article?.content}}/>
                </div>

            </main>
            <FooterComponent />
        </>
    )
}

export async function getServerSideProps(ctx) {
    try {
        console.log('article view');
        const article: any = await dbService.getBlogPost(ctx.params.id);
        article.dateAdded = article.dateAdded.seconds * 1000;
        return {
            props: {article}
        };
    } catch (err) {
        return {
            props: {article: null}
        }
    }
}

export default BlogDetail;
