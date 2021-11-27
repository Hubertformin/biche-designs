import React, {useEffect, useState} from "react";
import Nav from "../../components/nav";
import {dbService} from "../../firebase/db-service";
import SeoTags from "../../components/seo-tags";
import '../../styles/ShopItem.module.less';
import {Breadcrumb, Form, message, Select} from "antd";
import {FacebookOutlined, HomeOutlined, TwitterOutlined, WhatsAppOutlined} from "@ant-design/icons/lib";
import FooterComponent from "../../components/footer";
import {formatCurrency} from "../../utils/format-currency.util";
import {FacebookShareButton, TwitterShareButton, WhatsappShareButton} from "react-share";
import {CartContext} from "../../context/cartContext";
import {CartModel, ItemModel} from "../../models/item.model";
import {useRouter} from "next/router";
import {transformImageURL} from "../../utils/image-kit";

function ShopItem({item}: {item: ItemModel}) {
    const [form] = Form.useForm();
    const router = useRouter();
    const [viewImageIndex, setViewImageIndex] = useState(0);

    function showViewImage(index: number) {
        setViewImageIndex(index);
    }

    function addItemToCart(ctx, showMsg = true) {
        const cart: CartModel = {
            id: item.id,
            name: item.name,
            category: item.category,
            attributes: {
                color: form.getFieldsValue().color,
                size: form.getFieldsValue().size,
            },
            itemQuantity: item.quantity,
            quantity: 1,
            stockStatus: item.stockStatus,
            lowStockLevel: item.lowStockLevel,
            unitPrice: item.unitPrice,
            thumbnails: item.thumbnails
        };
        // setCartItems(cart);
        ctx.addToCart(cart);
        if (showMsg) {
            message.success(`"${item.name}: was added to cart`);
        }
    }

    function buyNow(context: any) {
        addItemToCart(context, false);
        // redirect to checkout
        router.push('/checkout');
    }

    const preOrder = (context) => {
        addItemToCart(context, false);
        // redirect to checkout
        router.push('/checkout?m=pre-order');
    };


    return(
        <CartContext.Consumer>{(context) => {
            return(
                <>
                    <SeoTags title={`${item.orderState === "PRE_ORDER" ? 'Pre-order' : 'Buy'} ${item.name} from BICHE shop`} imageUrl={item.thumbnails?.medium} description={item.description} />
                    <Nav />
                    <main className="pt-8 mb-16 md:mb-24 px-6 md:px-16">
                        <div className="px-6 mt-4 mb-8">
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    <HomeOutlined />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="/shop">
                                    <span>Shop</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>{item.category}</Breadcrumb.Item>
                                <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="row">
                            <div className="image-section col-sm-5 mb-6 md:mb-0">
                                <img className="view-img" src={transformImageURL(item.photos[viewImageIndex], 300, 300)} alt=""/>
                                <div className="image-options">
                                    {
                                        item.photos.map((photo,index) => {
                                            return(
                                                <div onClick={() => showViewImage(index)} key={'img-con-' + index} className={`image-con ${viewImageIndex == index ? 'active' : ''}`}>
                                                    <img key={'view-img-' + index} src={transformImageURL(photo, 70, 70)} alt=""/>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="details-section col-sm-7">
                                <h1 className="name">{item.name}</h1>
                                <h4 className="price">{formatCurrency(item.unitPrice)}</h4>
                                <Form form={form} layout="vertical" colon={false}>
                                    <div className="flex">
                                        <div className="pr-2">
                                            {
                                                item.colors?.length > 0 ?
                                                    <Form.Item label="Color" name="color" initialValue={item.colors[0]}>
                                                        <Select style={{ width: 120 }}>
                                                            {
                                                                item.colors.map((color, index) => {
                                                                    return <Select.Option key={'-color-'+ index} value={color}>{color}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    </Form.Item> : null
                                            }
                                        </div>
                                        <div className="pl-2">
                                            {
                                                item.sizes?.length > 0 ?
                                                    <Form.Item label="Size" name="size" initialValue={item.sizes[0]}>
                                                        <Select style={{ width: 120 }}>
                                                            {
                                                                item.sizes.map((size, index) => {
                                                                    return <Select.Option key={'-color-'+ index} value={size}>{size}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    </Form.Item> : null
                                            }
                                        </div>
                                    </div>
                                </Form>
                                {
                                    item.quantity > 0 ?
                                        <div className="actions">
                                            {item.quantity <= item.lowStockLevel ? <h1 className="text-lg my-4 text-red-500">Only {item.quantity} left in stock!</h1> : null}
                                            {
                                                item.orderState == "PRE_ORDER" ?
                                                    <>
                                                        <button className="btn-fill block" onClick={() => preOrder(context)}>PRE-ORDER</button>
                                                    </> :
                                                    <>
                                                        <button onClick={() => addItemToCart(context)} className="btn-outlined mb-3 block">ADD TO CART</button>
                                                        <button className="btn-fill block" onClick={() => buyNow(context)}>BUY NOW</button>
                                                    </>
                                            }
                                        </div> :
                                        <div className="actions">
                                            <h1 className="text-xl text-red-500">This item is unavailable</h1>
                                        </div>
                                }
                                <div className="share my-6">
                                    <p>Share</p>
                                    <FacebookShareButton url={`https://bichedesigns.com/shop/${item.id}`}>
                                        <span className="icon"><FacebookOutlined/></span>
                                    </FacebookShareButton>
                                    <TwitterShareButton url={`https://bichedesigns.com/shop/${item.id}`}>
                                        <span className="icon"><TwitterOutlined/></span>
                                    </TwitterShareButton>
                                    <WhatsappShareButton url={`https://bichedesigns.com/shop/${item.id}`}>
                                        <span className="icon"><WhatsAppOutlined /></span>
                                    </WhatsappShareButton>
                                </div>
                            </div>
                        </div>
                        <div className="description my-6 text-lg">{item.description}</div>
                    </main>
                    <FooterComponent/>
                </>
            )
        }}</CartContext.Consumer>
    );
}

export default ShopItem;

export async function getServerSideProps(ctx) {

    const item = await dbService.getItem(ctx.params.id);


    return {
        props: {item}
    }
}
