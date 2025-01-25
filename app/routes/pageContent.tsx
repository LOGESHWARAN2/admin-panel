import { useLoaderData } from "@remix-run/react";
import { db } from "~/db.server"; // Only import this in loader

export async function loader() {
    const data = await db.pageContent.findMany(); // Server-side logic
    return data;
};

export default function PageContentIndex() {
    const loadData = useLoaderData<typeof loader>(); // Get data from the loader function
    
    return (
        <>
            <h1>Page Content</h1>
        </>
    );
}