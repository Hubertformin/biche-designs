import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="stylesheet" href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"/>
                    <script src="https://www.paypal.com/sdk/js?client-id=AUgENhvlwDnbhbCoNczu07vv7YY34mjmteG0Qh1KpT8BTri84Zkn0hjZ97VWAj7Diqr4ZcXflD78P0YF&currency=EUR" data-sdk-integration-source="button-factory"></script>
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
