import { useAuthContext } from "../context/useAuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navigation() {

  

  const navigation = [
  { name: ' Chats', icon:<i className="fa-solid fa-comment fa-lg mr-2"></i>,  href: '/', current: true },
  { name: ' Profile', icon:<i className="fa-solid fa-circle-user fa-lg mr-2"></i>,  href: '/profile', current: false },
]

  const { logout, loggedInUser, profileImage  } = useAuthContext(); // Authentication context


  return (
    <aside className="flex w-35 flex-col justify-between border-r border-slate-300 bg-stone-50 py-8">
      <div>
        <p className="block px-4 py-2 text-center font-bold text-black">{loggedInUser}</p>
        <div className="mb-12 flex justify-center">
          <div className="relative">
            {profileImage && (
              <img
                src={profileImage}
                alt="User Profile Image"
                className="h-14 w-14 rounded-full"
              />
            )}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
        </div>


        <nav className="space-y-2 flex flex-col items-center rounded-xl active:bg-purple-100 px-4 py-4 active:text-blue-600 ">
          {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-blue-600 text-md text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 text-md',
                      'rounded-md px-3 py-2 text-md font-medium'
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}


        </nav>
      </div>


      <div className=" flex flex-row items-center justify-center ">
      <button
       className="px-6 text-center text-md cursor-pointer text-gray-700"
       onClick={logout}>

      <i className="fa-solid fa-arrow-right-from-bracket fa-md mr-2"></i>
        Log out
      </button>

      </div>

  


    </aside>
  );
}

