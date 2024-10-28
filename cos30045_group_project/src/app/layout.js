import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const getOrbitron = localFont({
  src: "../fonts/Orbitron.woff",
  variable: "--font-orbitron",
  weight: "100 900",
});

export const metadata = {
  title: "Mapping PM2.5",
  description: "A visualization project on PM2.5 levels around the world",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${getOrbitron.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
