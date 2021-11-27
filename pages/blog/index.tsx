import React, {useEffect, useState} from 'react';
import Nav from "../../components/nav";
import {List} from "antd";
import SeoTags from "../../components/seo-tags";
import {BlogPostModel} from "../../models/blog.model";
import {dbService} from "../../firebase/db-service";
import Link from "next/link";
import {formatDate} from "../../utils/date.utils";
import FooterComponent from "../../components/footer";

const contentStyle = {height: '300px',color: '#fff',lineHeight: '300px',textAlign: 'center',background: '#364d79'};

function BlogPage({articles}: {articles: BlogPostModel[]}) {
    const [posts, setPosts] = useState<BlogPostModel[]>(articles);

    /*useEffect(() => {
        setPosts(articles);
    }, []);*/

    useEffect(() => {
        if (posts.length === 0) {
            dbService.getBlogPosts()
                .then(posts => setPosts(posts));
        }
    }, []);

    return(
        <>
            <SeoTags title="Blog" description="learn more about styling and how you can create your own style from biche designs" />
            <Nav />
            <main className="px-6 md:px-10 pt-6 pb-24">
                {/*<Carousel dotPosition="right" autoplay={true} arrows={true} autoplaySpeed={6200}>
                    <div>
                        <h3 style={{height: '300px',color: '#fff',lineHeight: '300px',textAlign: 'center',background: '#364d79'}}>1</h3>
                    </div>
                    <div>
                        <h3 style={{height: '300px',color: '#fff',lineHeight: '300px',textAlign: 'center',background: '#364d79'}}>2</h3>
                    </div>
                    <div>
                        <h3 style={{height: '300px',color: '#fff',lineHeight: '300px',textAlign: 'center',background: '#364d79'}}>3</h3>
                    </div>
                    <div>
                        <h3 style={{height: '300px',color: '#fff',lineHeight: '300px',textAlign: 'center',background: '#364d79'}}>4</h3>
                    </div>
                </Carousel>*/}

                <List
                    itemLayout="vertical"
                    size="large"
                    header={<h1 className="font-bold text-xl">Blog</h1>}
                    /*pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}*/
                    dataSource={posts}
                    renderItem={(item: BlogPostModel) => (
                        <List.Item
                            key={item.id}
                            /*actions={[
                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            ]}*/
                            extra={
                                item.coverImageURL ? <img
                                    width={272}
                                    style={{height: '180px', objectFit: "cover"}}
                                    alt="logo"
                                    src={item.coverImageURL}
                                /> : null
                            }
                        >
                            <List.Item.Meta
                                title={<Link href={'/blog/' + item.id}><a className="font-bold text-lg">{item.title}</a></Link>}
                                description={formatDate(item.dateAdded)}
                            />
                            <section dangerouslySetInnerHTML={{__html: `${item.content.slice(0, 300)}...`}}></section>
                        </List.Item>
                    )}
                />

            </main>
            <FooterComponent/>
        </>
    )
}

export async function getStaticProps() {
    try {

        const _articles = await dbService.getBlogPosts();
        const articles: any[] = (_articles as any[]).map(a => {
            a.dateAdded = a.dateAdded.getTime();
            // a.dateAdded = new Date(a.dateAdded).getTime();
            return a;
        });

        return {
            props: {
                articles
            }
        }

    } catch (e) {
        return {
            props: {
                articles: []
            }
        }
    }
}

export default BlogPage;
