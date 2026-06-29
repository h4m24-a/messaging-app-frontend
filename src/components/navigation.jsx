import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline";

import { useAuthContext } from "../context/useAuthContext";
import { useLocation, Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const location = useLocation();
  const { logout, loggedInUser, profileImage } = useAuthContext();

  const navigation = [
    { name: "Chats", href: "/", icon: ChatBubbleLeftIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Create", href: "/create", icon: ChatBubbleLeftEllipsisIcon },
  ];

  return (
    <Disclosure as="div" className="flex">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-44 lg:flex-col lg:justify-between lg:border-r lg:border-slate-300 lg:h-screen lg:py-6">

        {/* Top */}
        <div>
          {/* User */}
          <div className="flex flex-col items-center mb-6">
            {profileImage && (
              <img
                src={profileImage}
                className="h-14 w-14 rounded-full object-cover"
                alt="profile"
              />
            )}
            <p className="mt-2 font-semibold">{loggedInUser}</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  location.pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                  "flex items-center gap-3 px-3 py-2 rounded-md font-medium"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        {/* Logout */}
        <div className="px-4 mb-20 flex flex-col items-end justify-end">
          <button
            onClick={logout}
            className="flex items-center cursor-pointer gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden w-full">
        
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-300">
          <p className="font-bold">{loggedInUser}</p>

          <Disclosure.Button className="p-2">
            {({ open }) =>
              open ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )
            }
          </Disclosure.Button>
        </div>

        {/* Panel */}
        <Disclosure.Panel className="p-4 space-y-4">
          
          {/* Profile */}
          <div className="flex justify-center">
            {profileImage && (
              <img
                src={profileImage}
                className="h-14 w-14 rounded-full"
                alt="profile"
              />
            )}
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  location.pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                  "flex items-center gap-3 px-3 py-2 rounded-md"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>

        </Disclosure.Panel>
      </div>

    </Disclosure>
  );
}