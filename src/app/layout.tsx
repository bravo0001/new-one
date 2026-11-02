import type { Metadata } from 'next';
import './globals.css';
import { EcoProvider } from '../context/EcoContext';
import { Web3Provider } from '../context/Web3Context';

export const metadata: Metadata = {
  title: 'City Guardian — AI-Powered Circular Campus Platform',
  description: 'Turn Waste Into Impact. AI-powered circular economy platform for college campuses and communities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&family=Do+Hyeon&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-squid-dark text-slate-100 min-h-screen antialiased squid-grid-bg font-sans">
        <Web3Provider>
          <EcoProvider>{children}</EcoProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
