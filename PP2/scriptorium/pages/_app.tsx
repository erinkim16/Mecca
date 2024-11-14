// pages/_app.js

import '../app/globals.css'; // adjust the path if needed
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
