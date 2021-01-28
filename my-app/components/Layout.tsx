import React, { ReactNode } from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    <header>
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">1 on 1 録画ツール</span>
      </nav>
    </header>
    {children}
  </div>
);

export default Layout;
