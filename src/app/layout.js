// app/layout.js or layout.tsx
import './globals.css';

export const metadata = {
  title: 'Instant Resume',
  description: 'AI-powered resume builder',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
