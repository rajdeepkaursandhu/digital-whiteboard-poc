import './globals.css';

export const metadata = {
  title: 'Digital Whiteboard',
  description: 'A dynamic, infinite canvas whiteboard application',
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
