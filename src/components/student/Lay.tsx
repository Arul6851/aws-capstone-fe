"use client";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import AdminNav from "../admin/Adminnav";
import AdminFooter from "../admin/AdminFooter";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Poppin = Poppins({ subsets: ["latin"], weight: "400" });

export default function Lay({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  if (pathname === "/") {
    return (
      <html lang="en">
        <body className={`${Poppin.className} text-content bg-base-100`}>
          {children}
        </body>
      </html>
    );
  } else if (pathname.startsWith("/admin")) {
    return (
      <html lang="en">
        <body className={`${Poppin.className} text-content bg-base-100`}>
          <div className="px-10">
            <AdminNav />
          </div>
          <div className=" container mx-auto bg-base-100`">
            <div className="">{children}</div>
          </div>
          <div className="px-10">
            <AdminFooter />
          </div>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en">
        <body className={`${Poppin.className} text-content bg-base-100`}>
          <div className="px-10">
            <Navbar />
          </div>
          <div className="container mx-auto bg-base-100 px-16">
            <div className="">{children}</div>
          </div>
          <div className="px-10">
            <Footer />
          </div>
        </body>
      </html>
    );
  }
}
