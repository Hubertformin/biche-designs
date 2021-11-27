import React, {useEffect} from 'react';
import SeoTags from "../components/seo-tags";
import Nav from "../components/nav";
import FooterComponent from "../components/footer";
import '../styles/Checkout.module.less';
import {CartContext} from "../context/cartContext";
import {loadStripe} from "@stripe/stripe-js/pure";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "../components/checktout-form";
import {Breadcrumb, Typography} from "antd";
import Link from "next/link";
import {HomeOutlined} from "@ant-design/icons/lib";
import {useUserAgent, UserAgent} from "next-useragent";
import {formatCurrency} from "../utils/format-currency.util";
import {useRouter} from "next/router";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_LIVE_KEY);

export function Checkout({userAgent}: {userAgent : UserAgent}) {
    const router = useRouter();
    const preOrderMode = (router.query.m === "pre-order");

    function initPayPalButton() {
        /*var description = document.querySelector('#smart-button-container #description');
        var amount = document.querySelector('#smart-button-container #amount');
        var descriptionError = document.querySelector('#smart-button-container #descriptionError');
        var priceError = document.querySelector('#smart-button-container #priceLabelError');
        var invoiceid = document.querySelector('#smart-button-container #invoiceid');
        var invoiceidError = document.querySelector('#smart-button-container #invoiceidError');
        var invoiceidDiv = document.querySelector('#smart-button-container #invoiceidDiv');*/

        // var elArr = [description, amount];

        /*if (invoiceidDiv.firstChild.innerHTML.length > 1) {
            invoiceidDiv.style.display = "block";
        }*/

        var purchase_units = [];
        purchase_units[0] = {};
        purchase_units[0].amount = {};

        function validate(event) {
            return event.value.length > 0;
        }

        // @ts-ignore
        paypal.Buttons({
            style: {
                color: 'gold',
                shape: 'rect',
                label: 'checkout',
                layout: 'vertical',

            },

            onInit: function (data, actions) {
                /*actions.disable();

                if(invoiceidDiv.style.display === "block") {
                    elArr.push(invoiceid);
                }

                elArr.forEach(function (item) {
                    item.addEventListener('keyup', function (event) {
                        var result = elArr.every(validate);
                        if (result) {
                            actions.enable();
                        } else {
                            actions.disable();
                        }
                    });
                });*/
            },

            onClick: function () {
                /*if (description.value.length < 1) {
                    descriptionError.style.visibility = "visible";
                } else {
                    descriptionError.style.visibility = "hidden";
                }

                if (amount.value.length < 1) {
                    priceError.style.visibility = "visible";
                } else {
                    priceError.style.visibility = "hidden";
                }

                if (invoiceid.value.length < 1 && invoiceidDiv.style.display === "block") {
                    invoiceidError.style.visibility = "visible";
                } else {
                    invoiceidError.style.visibility = "hidden";
                }*/

                purchase_units[0].description = "Purchase Test";
                purchase_units[0].amount.value = 200;

                /*if(invoiceid.value !== '') {
                    purchase_units[0].invoice_id = invoiceid.value;
                }*/
            },

            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: purchase_units,
                });
            },

            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    alert('Transaction completed by ' + details.payer.name.given_name + '!');
                });
            },

            onError: function (err) {
                console.log(err);
            }
        }).render('#paypal-button-container');
    }

    useEffect(() => {
        initPayPalButton();
    });

    return(
        <CartContext.Consumer>{(context) => {
            return(
                <>
                    <SeoTags title={"Checkout"}/>
                    <Nav />
                    <main className="md:px-10 pt-6 md:pt-10 pb-16 md:pb-24" style={{minHeight: '70vh'}}>
                        <div className="px-4 mb-6 md:mb-10">
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
                                <Breadcrumb.Item>Checkout</Breadcrumb.Item>
                            </Breadcrumb>
                            {/*<Typography.Title level={2}>Checkout</Typography.Title>*/}
                        </div>
                        <div className="row">
                            <div style={{padding: '0'}} className="col-sm-5 pt-4 bg-grey-100 px-6 rounded">
                                <h1 className="text-lg mb-0 px-6 md:px-0">Items</h1>
                                <CartList cart={context.cart} />
                                <div className="total py-3 px-4">
                                    <p><small>Total</small></p>
                                    <Typography.Title level={3}>{formatCurrency(context.getCartAmount())}</Typography.Title>
                                </div>
                            </div>
                            <div className="col-sm-7 border-t pt-4 md:pt-0 md:border-0 paypal-section">
                                <div className="paypal-container"
                                     style={{textAlign: 'center', marginTop: '0.625rem'}}
                                     id="paypal-button-container"
                                >

                                </div>
                            </div>
                        </div>
                    </main>
                    <FooterComponent/>
                </>
            );
        }}</CartContext.Consumer>
    );
}

function CartList({cart}) {
    return(
        <div key="cart-list" className="cart-list">
            {
                cart.map(item => {
                    return(
                        <div key={`cart-list-` + item.id} className="cart-list-item">
                            <div key={`img-con-` + item.id} className="img-container">
                                <span key={`indicator-` + item.id} className="indicator">{item.quantity}</span>
                                <img key={`img-` + item.id} src={item.thumbnails.small} alt="" />
                            </div>
                            <div key={`details-` + item.id} className="details">
                                <h1 key={`name-` + item.id} className="name">{item.name}</h1>
                                <p key={`cart-price-` + item.id} className="price">{formatCurrency(item.quantity * item.unitPrice)}</p>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export function getServerSideProps(ctx) {
    const ua = useUserAgent(ctx.req.headers['user-agent']);
    // console.log(ua);
    return {props: {userAgent: ua}}
}

export default Checkout;
