import BookDetailsView from "@/components/BookDetailsView";
export const metadata = { title: "Book Details" };
export default async function Page({ params }) {
    const { id } = await params;
    return <BookDetailsView id={id}/>;
}
