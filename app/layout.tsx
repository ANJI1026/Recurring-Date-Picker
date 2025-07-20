import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle"; // ✅ Add this

export const metadata = {
  title: "Recurring Date Picker",
  description: "Pick recurring dates like weekly, monthly or custom intervals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeToggle /> {/* ✅ Button shows in top-right corner */}
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1e293b", // dark background
                color: "#f8fafc", // light text
                borderRadius: "12px",
                padding: "12px 16px",
                fontWeight: "500",
              },
              className: "shadow-lg border border-blue-400",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
