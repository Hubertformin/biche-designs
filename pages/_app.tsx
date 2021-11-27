import React from "react";
import "../styles/antd.less";
import "../styles/fonts.less";
import "../styles/global.less";
import "../styles/nprogress.less";
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import CartContextProvider from "../context/cartContext";
//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// const dev = process.env.NODE_ENV === 'development';
// const server = dev ? 'http://localhost:3000' : 'https://thinkinary.com/';

function MyApp({ Component, pageProps }) {

    return (
      <>
        {/*<DefaultSeo
            openGraph={{
              type: 'website',
              locale: 'en_GB',
              url: 'https://www.bichedesigns.com/',
              site_name: 'Biche Designs',
            }}
            twitter={{
              handle: '@biche_designs',
              site: '@biche_designs',
              cardType: 'summary_large_image',
            }}
        />

      </>*/}
          <CartContextProvider>
              <Component {...pageProps} />
          </CartContextProvider>
      </>
  );
}

/*MyApp.getInitialProps = async (appContext) => {
    const { ctx } = appContext;
    // Calls `getInitialProps` and fills `appProps.pageProps`
    let error;
    const appProps = await App.getInitialProps(appContext);
    console.log(ctx.pathname);

    const { authToken } = cookies(ctx);
    // If token exists run Firebase validation on server side before rendering.
    if (authToken) {
        try {
            const headers = {
                'Context-Type': 'application/json',
                Authorization: JSON.stringify({ token: authToken }),
            };
            const {data: result} = await axios.post(`${server}/api/auth/validate`, { headers });
            console.log(result)
            return { ...result, ...appProps };
        } catch (e) {
        }
    }
    return { ...appProps };
};*/

export default MyApp;
