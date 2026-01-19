import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="flex bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}

          <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  padding: "14px 18px",
                  borderRadius: "10px",
                  fontSize: "14px"
                }
              }}
            />
        </main>
      </body>
    </html>
  );
}
