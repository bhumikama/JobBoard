import localFont from "next/font/local";
import "./_styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./_components/HomePageComponents/Footer";
import StoreProvider from "@/store/StoreProvider";
import QueryProvider from "@/store/QueryProvider";
import { TokenRefreshProvider } from "@/components/Context/TokenRefreshContext.js";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata = {
  title: "JobHunt",
};

export default function RootLayout({ children }) {
  return (
    <QueryProvider>
      <StoreProvider>
        <TokenRefreshProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
            >
              <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <main className="flex-grow pb-20">{children}</main>

              <Footer />
            </body>
          </html>
        </TokenRefreshProvider>
      </StoreProvider>
    </QueryProvider>
  );
}
