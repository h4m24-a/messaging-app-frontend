import { useAuthContext } from "../context/useAuthContext";

export default function Navigation() {

  const { logout, loggedInUser,  } = useAuthContext(); // Authentication context


  return (
    <aside className="flex w-35 flex-col justify-between border-r border-slate-300 bg-stone-50 py-8">
      <div>
        <p className="block px-4 py-2 text-center font-bold text-black">{loggedInUser}</p>
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <img
              src="/avatar.jpg"
              alt=""
              className="h-14 w-14 rounded-full"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
        </div>

        <nav className="space-y-3 px-3">
          <button className="flex w-full items-center gap-3 rounded-xl bg-purple-100 px-4 py-4 text-purple-600">
            💬 Chats
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-4 hover:bg-gray-100">
            👥 People
          </button>

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