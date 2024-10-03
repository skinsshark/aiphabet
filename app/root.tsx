import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import './tailwind.css';

import { Analytics } from '@vercel/analytics/react';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { property: 'og:image', content: '/preview.png' },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="mx-8 my-4 gap-16 flex flex-col justify-between h-[40svh]">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    ReactGA.initialize(import.meta.env.VITE_GA4_ID);
  }, []);

  return <Outlet />;
}
