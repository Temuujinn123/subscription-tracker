// components/Layout.tsx
import { ReactNode } from "react";
import Header from "@/components/Header";
import Head from "next/head";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Head>
        <title>SubTrack</title>
        <meta
          name="description"
          content="Subscripion tracker web-app for everyone"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
