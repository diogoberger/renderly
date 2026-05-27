import './globals.css';

export const metadata = {
  title: 'Renderly — HTML to PDF API',
  description: 'The developer-friendly PDF generation API. HTML to PDF in one API call.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
