import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "../component/sessionwrapper";
import ApolloWrapper from "../component/ApolloWrapper";
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BlogSpace - Share Your Stories",
  description: "A modern platform for sharing ideas, insights, and stories. Join our community of writers and readers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Clean up browser extension attributes before React hydrates
              (function() {
                if (typeof window !== 'undefined') {
                  const extensionAttrs = ['bis_skin_checked', 'bis_register'];
                  const observer = new MutationObserver(function() {
                    extensionAttrs.forEach(attr => {
                      document.querySelectorAll('[' + attr + ']').forEach(el => {
                        el.removeAttribute(attr);
                      });
                    });
                  });
                  if (document.body) {
                    observer.observe(document.body, { 
                      attributes: true, 
                      childList: true, 
                      subtree: true 
                    });
                  }
                }
              })();
            `
          }}
        />
      </head>
      <SessionWrapper>
        <ApolloWrapper>
            <body className={inter.className} suppressHydrationWarning={true}>
              <div 
                style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
                suppressHydrationWarning={true}
              >
                <Header />
                <main style={{ flex: 1, paddingTop: '80px' }} suppressHydrationWarning={true}>
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#2d3748',
                  color: '#fff',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#4fd1c7',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f56565',
                    secondary: '#fff',
                  },
                },
              }}
              containerStyle={{
                /* Prevent browser extensions from interfering */
                isolation: 'isolate',
              }}
            />
          </body>
        </ApolloWrapper>
      </SessionWrapper>
    </html>
  );
}