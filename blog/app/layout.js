import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "../component/sessionwrapper";
import ApolloWrapper from "../component/ApolloWrapper";
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BlogSpace - Share Your Stories",
  description: "A modern platform for sharing ideas, insights, and stories. Join our community of writers and readers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionWrapper>
        <ApolloWrapper>
          <body className={inter.className}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1, paddingTop: '80px' }}>
                {children}
              </main>
              <Footer />
            </div>
          </body>
        </ApolloWrapper>
      </SessionWrapper>
    </html>
  );
}