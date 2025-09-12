import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/services/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          {/* <ThemeProvider> */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {/* </ThemeProvider> */}
        </GoogleOAuthProvider>
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
