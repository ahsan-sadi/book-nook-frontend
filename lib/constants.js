export const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];
export const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
