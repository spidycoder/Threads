"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
function Bottombar() {
  const router = useRouter();
  const path = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (path.includes(link.route) && link.route.length > 1) ||
            path === link.route;
          return (
            <div>
              <Link
                href={link.imgURL}
                key={link.label}
                className={`bottombar_link ${isActive && "bg-primary-500"}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className="text-subtle-medium text-light-1 max-sm:hidden">
                  {/* here we are trying to get the first letter of the string */}
                  {link.label.split(/\s+/)[0]}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default Bottombar;
