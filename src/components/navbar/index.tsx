// "use client";

// import { useState } from "react";
// import { Menu, X } from "lucide-react";

// export interface NavItem {
//   label: string;
//   key: string;
//   subTitle:string
// }

// interface NavbarProps {
//   logo: string;
//   links: NavItem[];
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// export default function Navbar({
//   logo,
//   links,
//   activeTab,
//   onTabChange,
// }: NavbarProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const getNavLinkClass = (key: string) => {
//     const isActive = activeTab === key;

//     return `
//       relative w-fit font-medium transition-colors duration-300
//       ${
//         isActive
//           ? "text-blue-600"
//           : "text-gray-700 hover:text-blue-600"
//       }
//       after:absolute after:left-0 after:-bottom-1
//       after:h-0.5 after:bg-blue-600
//       after:transition-all after:duration-300
//       cursor-pointer
//       ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
//     `;
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-[#D0E2FF] shadow-md">
//       <div className="mx-5 flex max-w-10xl items-center justify-between py-4">
//         <div className="text-xl font-bold text-gray-900">
//           {logo}
//         </div>

//         <div className="hidden items-center gap-8 md:flex">
//           {links.map((link) => (
//             <button
//               key={link.key}
//               onClick={() => onTabChange(link.key)}
//               className={getNavLinkClass(link.key)}
//             >
//               {link.label}
//             </button>
//           ))}
//         </div>

//         <button
//           type="button"
//           aria-label="Toggle Menu"
//           className="md:hidden"
//           onClick={() => setIsOpen((prev) => !prev)}
//         >
//           <div
//             className={`transition-transform duration-300 ${
//               isOpen ? "rotate-180" : ""
//             }`}
//           >
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </div>
//         </button>
//       </div>

//       <div
//         className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
//           isOpen
//             ? "max-h-96 opacity-100"
//             : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="border-t bg-white px-6 py-4">
//           <div className="flex flex-col gap-5">
//             {links.map((link) => (
//               <button
//                 key={link.key}
//                 onClick={() => {
//                   onTabChange(link.key);
//                   setIsOpen(false);
//                 }}
//                 className={getNavLinkClass(link.key)}
//               >
//                 {link.label} 
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export interface NavItem {
  label: string;
  key: string;
  subTitle: string;
}

interface NavbarProps {
  logo: string;
  links: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({
  logo,
  links,
  activeTab,
  onTabChange,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = (key: string) => {
    const isActive = activeTab === key;

    return `
      relative w-fit font-medium transition-all duration-300 cursor-pointer
      ${
        isActive
          ? "text-blue-600"
          : "text-gray-600 hover:text-blue-600"
      }
      after:absolute after:left-0 after:-bottom-1
      after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-indigo-600
      after:transition-all after:duration-300
      hover:scale-105
      ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
    `;
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 shadow-lg backdrop-blur-sm">
      <div className="mx-5 flex max-w-10xl items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {logo}
          </div>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => onTabChange(link.key)}
              className={getNavLinkClass(link.key)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Toggle Menu"
          className="md:hidden transition-transform duration-300 hover:scale-110"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            {isOpen ? (
              <X size={28} className="text-blue-600" />
            ) : (
              <Menu size={28} className="text-gray-700" />
            )}
          </div>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
          isOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-inner">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => {
                  onTabChange(link.key);
                  setIsOpen(false);
                }}
                className={`${getNavLinkClass(link.key)} py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-300`}
              >
                <span className="block">{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}