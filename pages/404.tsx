import React, {CSSProperties} from 'react';
import Link from "next/link";

function NotFoundPage() {
    return(
        <section style={styles.page} className="flex flex-col justify-center align-items-center">
            <div className="flex flex-col align-items-center">
                <img className="mb-6" style={{height: 60}}
                     src="https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Ftext-logo.png?alt=media&token=1b860f6c-ab2d-4200-a02a-12a203460d84"
                />
                <img style={{width: 250, margin: 'auto'}} src="https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Fnot-found.png?alt=media&token=016f5502-ea5a-4a7e-85d5-5c07328e8612" alt=""/>
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold">Whoops! Lost in space?</h1>
                <p className="text-grey-400 mb-0">The page you're looking for isn't found or has been taken down for maintainance</p>
                <p className="text-grey-400">We suggest you go back home</p>
                <Link href="/">
                    <button className="btn-fill">Back Home</button>
                </Link>
            </div>
        </section>
    );
}

const styles = {
    page: {
        height: '100vh'
    }
};

export default NotFoundPage;
