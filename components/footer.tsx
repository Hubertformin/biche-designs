import React from 'react';
import '../styles/Footer.module.less';
import Link from "next/link";
import {message} from "antd";

export default function FooterComponent() {

    const addToMailingList = () => {
        if (typeof window !== "undefined") {
            const email = document.getElementById('emailInput');
            // add to mailing list
            message.success("Thank you! We'll keep in touch.");
            // add to send grid list
            // @ts-ignore
            email.value = '';
        }
    };

    return(
        <>
            <section id="page__footer" className="px-10 pt-16">
                <div className="row">
                    <div className="col-sm-3">
                        <h1 className="title">Contact info</h1>
                        <div className="contact">
                            <p>+ 3(935) 1 962 8987</p>
                            <p>Rome, Italy</p>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <h1 className="title">Navigate</h1>
                        <ul>
                            <li><Link href="/"><a>Home</a></Link></li>
                            <li><Link href="/blog"><a>Learn more</a></Link></li>
                            <li><Link href="/shop"><a>Shop</a></Link></li>
                            <li><Link href="/journal"><a>Journal</a></Link></li>
                        </ul>
                    </div>
                    <div className="col-sm-3">
                        <h1 className="title">Get help</h1>
                        <ul>
                            {/*<li>Delivery information</li>*/}
                            <li><Link href="/terms-and-conditions">Terms & conditions</Link></li>
                            <li><a href="mailto:bichedesigns@gmail.com"></a></li>
                            {/*<li>Returns & Refunds</li>*/}
                            {/*<li>FAQs</li>*/}
                        </ul>
                    </div>
                    <div className="col-sm-3">
                        <h1 className="title">Let's stay in touch</h1>
                        <div className="subscribe-form">
                            <input type="email" id="emailInput" placeholder="Enter email" />
                            <button onClick={addToMailingList}>Subscribe</button>
                        </div>
                        <p>
                            Keep up to date with our latest news and special offers.
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <p>We accept</p>
                        <p className="flex mt-3">
                            <img style={{height: '20px'}} src="/images/mastercard_inverse.svg" className="mr-3" />
                            <img style={{height: '20px'}} src="/images/visa_inverse.svg" />
                        </p>
                    </div>
                </div>
                <div className="copy-right">
                    <p>© {new Date().getFullYear
                    ()} BICHE DESIGNS</p>
                    <p>
                        All rights reserved  <br/>
                        <a href="mailto:hformin@gmail.com"><small style={{color: '#41454e', fontSize: 12}}>Designed by Hubert Formin</small></a>
                    </p>
                </div>
            </section>
        </>
    )
}
