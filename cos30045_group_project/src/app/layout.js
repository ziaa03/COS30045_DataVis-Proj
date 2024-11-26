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

const roboto = localFont({
  src: "../fonts/Roboto-Light.woff",
  variable: "--font-roboto",
  weight: "100 900",
});

const copernicus = localFont({
  src: "../fonts/Copernicus-MediumItalic.woff",
  variable: "--font-copernicus",
  weight: "100 900",
});

const century = localFont({
  src: "../fonts/CenturyGothic.woff",
  variable: "--font-century",
  weight: "100 900",
});


export const metadata = {
  title: "A World in Haze: Mapping Global Air Pollution",
  description: "An exploration of air quality through the lens of PM2.5 data worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${getOrbitron.variable} ${roboto.variable} ${copernicus.variable} ${century.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


