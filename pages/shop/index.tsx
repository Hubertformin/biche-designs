import React, {useEffect, useState} from "react";
import Nav from "../../components/nav";
import '../../styles/ShopHome.module.less';
import {Breadcrumb, Button, message, Skeleton} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import {formatCurrency} from "../../utils/format-currency.util";
import SeoTags from "../../components/seo-tags";
import {ItemCategoryModel, ItemModel} from "../../models";
import {dbService} from "../../firebase/db-service";
import FooterComponent from "../../components/footer";
import Link from "next/link";

function ShopHome() {
    const [categories, setCategories] = useState<ItemCategoryModel[]>([]);
    const [items, setItems] = useState<ItemModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaginating, setIsPaginating] = useState(false);

    useEffect(() => {
        if (items.length === 0) {
            dbService
                .getItems({limit: 40})
                .then(items => {
                    console.log(items);
                    setItems(items);
                    setLoading(false);
                }).catch(err => {
                    console.error(err);
                    message.warn("There was an error loading this page. Please refresh the page");
            });
        }
        if (categories.length === 0) {
            dbService
                .getCategories()
                .then(cats => {
                    console.log(cats);
                    setCategories(cats);
                }).catch(err => {
                    console.error(err);
                    message.warn("There was an error loading this page. Please refresh the page");
            });
        }
    }, []);

    const loadMore = () => {
        // set loading state
        setIsPaginating(true);
        dbService
            .paginateItems(items[items.length - 1])
            .then(newItems => {
                setItems([...items, ...newItems]);
            })
            .catch(err => {
                console.error(err);
                message.warn("There was an error loading more items");
            }).finally(() => {
            setIsPaginating(false);
        });

    };

    function onCategorySelect(name: string) {
        if (!name) {
            return;
        }
        setLoading(true);
        let promise: Promise<any>;
        if (name === 'ALL') {
            promise = dbService.getItems({limit: 25});
        } else {
            promise = dbService.getItemsByCategory(name);
        }
        // promise handle
        promise
            .then(items => {
                console.log(items);
                setItems(items);
            })
            .catch(e => {
                console.error(e);
                message.error("Unable to load items");
            })
            .finally(() => {
                setLoading(false);
            });

    }

    return (
        <>
            <SeoTags title="Shop on Biche Designs" description="Explore Biche designs inventory" />
            <Nav />
            <section className="body pt-6 md:pt-16 mb-16 md:mb-24 px-6 md:px-16 md:flex">
                <div className="categories-panel md:pl-10">
                    {
                        categories.length > 0 ?
                            <ul>
                                <li onClick={() => onCategorySelect('ALL')}>All items</li>
                                {
                                    categories.map((cat, index) => {
                                        return (<li onClick={() => onCategorySelect(cat.name)} key={index}>{cat.name}</li>);
                                    })
                                }
                            </ul> :
                            <>
                                <div className="mb-4">
                                    <Skeleton.Input style={{width: 200}} active />
                                </div>
                                <div className="mb-4">
                                    <Skeleton.Input style={{width: 200}} active />
                                </div>
                                <div className="mb-4">
                                    <Skeleton.Input style={{width: 200}} active />
                                </div>
                                <div className="mb-4">
                                    <Skeleton.Input style={{width: 200}} active />
                                </div>
                            </>
                    }
                </div>
                <div className="items-panel">
                    <div className="px-6">
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link href="/">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link href="/shop">
                                    <span>Shop</span>
                                </Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="items">
                        {
                            !loading ? items.map((it, index) => {
                                return <ShopItemCard item={it} key={index} />;
                            }) :
                                Array(8).fill(0).map((_, index) => {
                                  return (
                                      <div key={"sk-container-" + index} className="">
                                          <Skeleton.Input key={"sk-in-" + index} className="skeleton_image_container" style={{height: 257}} active />
                                          <div key={"sk-text-con-" + index} className="mt-2 mb-0">
                                              <Skeleton.Input key={"sk-text-" + index} className="skeleton_text" active />
                                          </div>
                                      </div>
                                  );
                                })
                        }
                    </div>
                    {
                        !loading && items.length > 0 ?
                            <div className="py-3 text-center">
                                <Button type="link" onClick={loadMore} loading={isPaginating}>Load more</Button>
                            </div>
                            :  null
                    }
                </div>
            </section>
            <FooterComponent />
        </>
    )
}

function ShopItemCard({item}) {
    return(
      <div className="item-card">
          <div className="image-container">
              <Link href={`/shop/${item.id}`}>
                  <img src={item.thumbnails.medium} alt={item.name} />
              </Link>
          </div>
          <div className="footer">
              <Link href={`/shop/${item.id}`}>
                  <h1 className="item-name">{item.name}</h1>
              </Link>
              <div className="price-container">
                  {/*<p className="price discount">{formatCurrency(215)}</p>*/}
                  <p className="price">{formatCurrency(item.unitPrice)}</p>
              </div>
              {/*<button className="btn-outlined">ADD TO CART</button>*/}
          </div>
      </div>
    );
}

/*export async function getStaticProps() {
    try {
        const _items = await dbService
            .getItems({limit: 25});
        let _categories = await dbService
            .getCategories();
        _categories = _categories.map(cat => {
           cat.addedDate = cat.addedDate.seconds * 1000;
           return cat;
        });
        return {
            props: {_items, _categories}
        }
    } catch (e) {
        return {
            props: {_items: [], _categories: []}
        }
    }
}*/

export default ShopHome;
