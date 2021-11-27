import React from 'react';
import SeoTags from "../components/seo-tags";
import Head from "next/head";
import Nav from "../components/nav";


function ErrorPage() {
    return(
        <>
            <Head>
                <title>An Error occured</title>
            </Head>
            <Nav/>
            <main>
                <section className="center-block">
                    <h1>Opps! Something isn't right..</h1>
                    <p>There was an error communication with our servers</p>
                    <p>Make sure a a good internet connection, else refresh this page in a few seconds</p>
                </section>
            </main>
        </>
    )
}

export default ErrorPage;
