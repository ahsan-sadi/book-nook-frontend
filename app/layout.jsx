import { Young_Serif, Hanken_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { cn } from "@/lib/utils";

const display = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-young-serif" });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });

export const metadata = {
    title: { default: "BookNook | A Small Online Library", template: "BookNook | %s" },
    description: "Add a book, borrow a book, return a book.",
};
// Apply the saved theme before first paint to avoid a flash (shadcn dark mode = .dark on <html>)
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }) {
    return (<html lang="en" suppressHydrationWarning className={cn(display.variable, sans.variable, "font-sans")}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head>
      <body className="flex min-h-screen flex-col bg-background text-foreground grain">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" toastOptions={{ duration: 3500 }}/>
      </body>
    </html>);
}
