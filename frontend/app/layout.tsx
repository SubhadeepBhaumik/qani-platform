import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QANI',
  description: 'AI-Powered Recruitment Screening',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
