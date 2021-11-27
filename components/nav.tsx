import React, {useEffect, useState} from 'react';
import "../styles/Nav.module.less";
import Link from 'next/link'
import {InstagramOutlined, FacebookOutlined, PhoneOutlined, MailOutlined, MenuOutlined, MinusOutlined} from '@ant-design/icons';
import {useWindowSize} from "../utils/screen";
import {Badge, Drawer} from "antd";
import {CloseOutlined, PlusOutlined, ShoppingCartOutlined, TwitterOutlined} from "@ant-design/icons/lib";
import {formatCurrency} from "../utils/format-currency.util";
import {CartContext} from "../context/cartContext";

function Nav() {
    const [cartVisible, setCartVisible] = useState(false);
    const [sideNavVisible, setSideNavVisible] = useState(false);

    const size = useWindowSize();

    function changeCartItemQty(ctx, index, operation: string) {
        const _cart = ctx.cart;
        if (operation == 'ADD') {
            _cart[index].quantity += 1;
        } else {
            if (_cart[index].quantity < 2) {
                return;
            }
            _cart[index].quantity -= 1;
        }
        // update cart
        ctx.setCartItems(_cart);

    }

    return(
        <CartContext.Consumer>{(context) => {
            return(
                <>
                    <nav id="md-toolbar">
                        <div className="nav-section">
                            <div className="nav-row">
                                <ul className="icons-list">
                                    <li>
                                        <a href="https://instagram.com/bichedesigns" target="_blank"><InstagramOutlined className="toolbar-icons" /></a>
                                    </li>
                                    <li>
                                        <a href="https://www.facebook.com/BICHE-111714260421251" target="_blank"><FacebookOutlined className="toolbar-icons" /></a>
                                    </li>
                                </ul>
                            </div>
                            <div className="nav-row">
                                <ul className="nav-links">
                                    <li>
                                        <Link href="/">
                                            <a>HOME</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/shop/">
                                            <a>SHOP</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/journal/">
                                            <a>JOURNAL</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/blog/">
                                            <a>LEARN MORE</a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="nav-section brand">
                            <h1 className="title">BICHE</h1>
                            <h2 className="subtitle">D E S I G N S</h2>
                        </div>
                        <div className="nav-section">
                            <div className="nav-row">
                                <ul className="icons-list">
                                    <li><PhoneOutlined className="toolbar-icons" />&nbsp;+39 351 962 8987</li>
                                    <li><a href="mailto:info@bichedesigns.com" target="_blank"><MailOutlined className="toolbar-icons" />&nbsp;info@bichedesigns.com</a></li>
                                </ul>
                            </div>
                            <div className="nav-row">
                                <ul className="nav-links">
                                    {/*<li>
                                        <Link href="/about/">
                                            <a>ABOUT</a>
                                        </Link>
                                    </li>*/}
                                    <li>
                                        <a style={{padding: '0 15px'}} onClick={() => setCartVisible(true)}>
                                            <Badge count={context.cart.length} >
                                                <span style={{display: 'block', padding: '2px 8px'}}>CART</span>
                                            </Badge>
                                        </a>
                                    </li>
                                    <li style={{paddingTop: '15px'}}>
                                        {/*<Link href="/book-session"></Link>*/}
                                        <a href="https://calendly.com/lenorasconfidentcloset/strategy-session" target="_blank" className="btn-fill">
                                            BOOK NOW
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <nav id="sm-toolbar">
                        <span className="leading cursor-pointer" onClick={() => setSideNavVisible(true)}>
                            <MenuOutlined />
                        </span>
                        <div className="nav-section brand">
                            <h1 className="title">BICHE</h1>
                            <h2 className="subtitle">D E S I G N S</h2>
                        </div>
                        <div className="trail">
                            {/*<Link href="/book-session"></Link>*/}
                            <a href="https://calendly.com/lenorasconfidentcloset/strategy-session" target="_blank" className="btn-fill">
                                BOOK NOW
                            </a>
                        </div>
                    </nav>

                    <Drawer
                        placement="left"
                        closable={false}
                        onClose={() => setSideNavVisible(false)}
                        visible={sideNavVisible}
                        key="sidenav"
                    >

                        <div className="side-wrapper px-6 pt-4">
                            <div className="nav-section brand mb-6">
                                <h1 className="title">BICHE</h1>
                                <h2 className="subtitle">D E S I G N S</h2>
                            </div>
                            <ul className="nav-links mb-6">
                                <li>
                                    <Link href="/">
                                        <a>HOME</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shop/">
                                        <a>SHOP</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/journal/">
                                        <a>JOURNAL</a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog/">
                                        <a>LEARN MORE</a>
                                    </Link>
                                </li>
                                {/*<li>
                                    <Link href="/about/">
                                        <a>ABOUT</a>
                                    </Link>
                                </li>*/}
                                <li>
                                    <a onClick={() => {
                                        setSideNavVisible(false);
                                        setCartVisible(true);
                                    }}>
                                        <Badge count={0} >
                                            <span style={{color: 'white'}}>CART</span>
                                        </Badge>
                                    </a>
                                </li>
                            </ul>
                            <div className="py-4 border-t">
                                <ul>
                                    <li><a href="https://instagram.com/bichedesigns" target="_blank" className="icon"><InstagramOutlined />&nbsp;<span>Instagram</span></a></li>
                                    <li><a href="https://www.facebook.com/BICHE-111714260421251" target="_blank" className="icon"><FacebookOutlined />&nbsp;<span>Facebook</span></a></li><li>
                                    <PhoneOutlined className="toolbar-icons" />&nbsp;+39 351 962 8987</li>
                                </ul>
                            </div>
                        </div>
                    </Drawer>


                    <Drawer
                        placement="right"
                        closable={true}
                        onClose={() => setCartVisible(false)}
                        visible={cartVisible}
                        title="CART"
                        width={size.width < 768 ? '300px' : '400px'}
                        key="cart-drawer"
                        footer={
                            context.cart.length > 0 ?
                                <div className="">
                                    <small>TOTALs</small>
                                    <h1 className="text-xl font-bold">{formatCurrency(context.getCartAmount())}</h1>
                                    <Link href="/checkout">
                                        <button className="btn-fill blow w-full">CHECKOUT</button>
                                    </Link>
                                </div> : null
                        }
                    >
                        {
                            context.cart.map((item, index) => {
                                return (
                                    <section key={'cart-item-' + item.id} className="cart-item">
                                        <div className="image-container">
                                            <img src={item.thumbnails.small} alt={item.name} />
                                        </div>
                                        <div className="details">
                                            <h4 className="">{item.name}</h4>
                                            <div className="controls">
                                                <button className="icon" onClick={() => changeCartItemQty(context, index,'MINUS')}><MinusOutlined /></button>
                                                <span className="text"><p>{item.quantity}</p></span>
                                                <button className="icon" onClick={() => changeCartItemQty(context, index,'ADD')}><PlusOutlined /></button>
                                            </div>
                                            <p className="price my-2" id={'c-price-' + index}>{formatCurrency(item.quantity * item.unitPrice)}</p>
                                        </div>
                                        <div className="close">
                                            <button onClick={() => context.removeItem(item.id)} className="icon">
                                                <CloseOutlined />
                                            </button>
                                        </div>
                                    </section>
                                );
                            })
                        }
                        {/*show empty icon*/}
                        {
                            context.cart.length < 1 ?
                                <section className="h-full flex flex-col justify-center align-items-center">
                                    <img src="/images/empty-cart.svg" style={{height: 150}} alt="" />
                                    <p className="text-lg mt-4">Your shopping bag is empty</p>
                                    <Link href="/shop">
                                        <button className="btn-fill">START SHOPPING</button>
                                    </Link>
                                </section> : null
                        }
                     </Drawer>

                    {
                        context.cart.length > 0 ?
                            <button onClick={() => setCartVisible(true)} id="FAB">
                                <Badge count={context.cart.length} >
                                    <ShoppingCartOutlined style={{fontSize: 30, color: 'white'}} />
                                </Badge>
                            </button> : null
                    }
                </>
            );
        }}</CartContext.Consumer>
        /*{
            size.width > 767 ? mdToolbar() : smToolbar()
        }*/
    );
}


export default Nav;
