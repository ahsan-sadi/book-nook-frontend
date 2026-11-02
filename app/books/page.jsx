import BooksView from "@/components/BooksView";

export const metadata = { title: "All Books" };

// Thin server page: reads the URL and hands filters to the client view,
// which renders the local shelf (lib/store.js).
export default async function AllBooks({ searchParams }) {
    const params = await searchParams;
    const category = typeof params?.category === "string" ? params.category : "All";
    const search = typeof params?.search === "string" ? params.search : "";
    return <BooksView category={category} search={search}/>;
}
