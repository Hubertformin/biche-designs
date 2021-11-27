import AdminNav from "../../../components/admin-nav";
import React from "react";
import SeoTags from "../../../components/seo-tags";


export default function Dashboard() {
    return(
        <>
            <SeoTags title="Dashboard" />
            <AdminNav>
                <section className="h-full bg-white flex justify-center align-item-center">
                    <h1>There are no reports to show at this time!</h1>
                </section>
            </AdminNav>
        </>
    )
}
