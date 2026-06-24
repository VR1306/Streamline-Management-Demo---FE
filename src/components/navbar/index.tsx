// "use client";

// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import {
//   Control,
//   UseFormReturn,
// } from "react-hook-form";

// import { FormValues } from "@/src/clients/layout";
// import NavbarSelect from "../navbarSelect";

// export interface NavItem {
//   label: string;
//   key: string;
//   subTitle: string;
// }

// interface NavbarProps {
//   control: Control<FormValues>;
//   formMethods: UseFormReturn<FormValues>;
//   activeTab: string;
//   logo?: string;
//   links: NavItem[];
//   onTabChange: (tab: string) => void;
// }

// export default function Navbar({
//   links,
//   activeTab,
//   onTabChange,
//   control,
// }: NavbarProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const getNavLinkClass = (key: string) => {
//     const isActive = activeTab === key;

//     return `
//       relative w-fit font-medium transition-all duration-300 cursor-pointer
//       ${
//         isActive
//           ? "text-blue-600"
//           : "text-gray-600 hover:text-blue-600"
//       }
//       after:absolute after:left-0 after:-bottom-1
//       after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-indigo-600
//       after:transition-all after:duration-300
//       hover:scale-105
//       ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
//     `;
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 shadow-lg backdrop-blur-sm">
//       <div className="mx-5 flex max-w-10xl items-center justify-between py-4">
//         {/* Left Section */}
//          <div className="flex items-center gap-4">
//   <NavbarSelect
//     control={control}
//     name="moduleType"
//     className="transition-all duration-300"
//     options={[
//       {
//         label: 'Streamline Management',
//         value: 'streamline-management',
//       },
//       {
//         label: 'On Demand Refresh',
//         value: 'on-demand-refresh',
//       },
//     ]}
//   />
//         </div>

//         {/* Desktop Menu */}
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

//         {/* Mobile Menu Button */}
//         <button
//           type="button"
//           aria-label="Toggle Menu"
//           className="md:hidden transition-transform duration-300 hover:scale-110"
//           onClick={() => setIsOpen((prev) => !prev)}
//         >
//           <div
//             className={`transition-transform duration-300 ${
//               isOpen ? "rotate-180" : ""
//             }`}
//           >
//             {isOpen ? (
//               <X size={28} className="text-blue-600" />
//             ) : (
//               <Menu size={28} className="text-gray-700" />
//             )}
//           </div>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
//           isOpen
//             ? "max-h-96 opacity-100"
//             : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-inner">
//           <div className="flex flex-col gap-4">
//             {links.map((link) => (
//               <button
//                 key={link.key}
//                 onClick={() => {
//                   onTabChange(link.key);
//                   setIsOpen(false);
//                 }}
//                 className={`${getNavLinkClass(
//                   link.key
//                 )} py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-300`}
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

'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import {
  Control,
  UseFormReturn,
} from 'react-hook-form';

import NavbarSelect from '../navbarSelect';
import { FormValues } from '@/src/clients/layout';

export interface NavItem {
  label: string;
  key: string;
  subTitle: string;
}

interface NavbarProps {
  control: Control<FormValues>;
  formMethods: UseFormReturn<FormValues>;
  activeTab: string;
  logo?: string;
  links: NavItem[];
  onTabChange: (tab: string) => void;
}

export default function Navbar({
  links,
  activeTab,
  onTabChange,
  control,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = (key: string) => {
    const isActive = activeTab === key;

    return `
    relative whitespace-nowrap font-medium transition-all duration-300 cursor-pointer
    ${isActive
        ? 'text-[#1D2B50]'
        : 'text-gray-600 hover:text-[#1D2B50]'
      }
    after:absolute after:left-0 after:-bottom-1
    after:h-0.5 after:bg-[#1D2B50]
    after:transition-all after:duration-300
    ${isActive
        ? 'after:w-full'
        : 'after:w-0 hover:after:w-full'
      }
  `;
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 shadow-md backdrop-blur-sm border-b border-[#D4D7E3]">
      <div className="px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Module Select */}
          <div className="min-w-0 flex-1 md:flex-none md:min-w-[280px]">
            <NavbarSelect
              control={control}
              name="moduleType"
              options={[
                {
                  label: 'Streamline Management',
                  value: 'streamline-management',
                },
                {
                  label: 'On Demand Refresh',
                  value: 'on-demand-refresh',
                },
              ]}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => onTabChange(link.key)}
                className={getNavLinkClass(link.key)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle Menu"
            className="
    flex h-10 w-10 items-center justify-center
    rounded-lg md:hidden
    hover:bg-[#DDEAFC]
    transition-all duration-200
  "
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? (
              <X
                size={22}
                className="text-[#1D2B50]"
              />
            ) : (
              <Menu
                size={22}
                className="text-[#1D2B50]"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
    overflow-hidden transition-all duration-300 ease-in-out md:hidden
    ${isOpen
            ? 'max-h-[400px] opacity-100'
            : 'max-h-0 opacity-0'
          }
  `}
      >
        <div className="border-t border-[#D4D7E3] bg-[#F3F8FF]/95 px-4 py-3 backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive = activeTab === link.key;

              return (
                <button
                  key={link.key}
                  type="button"
                  onClick={() => {
                    onTabChange(link.key);
                    setIsOpen(false);
                  }}
                  className={`
        rounded-xl px-4 py-3 text-left text-sm font-medium
        transition-all duration-200
        ${isActive
                      ? 'bg-[#1D2B50] text-white shadow-md'
                      : 'bg-white text-[#1D2B50] hover:bg-[#DDEAFC]'
                    }
      `}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}