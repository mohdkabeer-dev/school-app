
import Header from './components/Header';
import './globals.css'; // Make sure Tailwind is imported

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
