import { useQuery , useQueryClient} from "@tanstack/react-query";
import { useAuthContext } from "../context/useAuthContext";
import getAllUsers from "../services/allUsers";
import createConversation from "../services/createConversation";
import { useState } from "react";

const CreateConversationModal = ({ className = "" }) => {

  
  const { accessToken } = useAuthContext();

  const queryClient = useQueryClient()

  const [userBId, setUserBId] = useState();
  const [success, setSuccess] = useState("");
  const [error, setError] =  useState("")
  const [userError, setUserError] = useState("")

  const [search, setSearch] = useState("")



  const{ data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(accessToken),
    enabled: !!accessToken
  })

  
const users = data?.users || [];   // storing data of users
  const filteredUsers =     // creates a new array of matching users only 
    users.filter((user) =>
      //  "john".includes("jo") → if true   - User is kept
      user?.username?.toLowerCase().includes(search.toLowerCase()) // pass the element that you want to check for as an argument to .includes, here I pass the search state which stores the value from the form.
    );
  

const HandleCreateConversation = async () => {
  try {

    if (!userBId) {
      return setUserError("Select a user")
    }
    const response = await createConversation(accessToken, userBId);

    setSuccess(response.message);
    setError("");
    setUserError("")
    setUserBId("")
    setSuccess("")
    await queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });

    await queryClient.refetchQueries({
      queryKey: ["conversations"],
    });
  } catch (error) {
    setError(error.message);
    setUserBId("")
    setUserError("")
    setSuccess("");
  }
};


const HandleUserId = (userId) => {
  setUserBId(userId);
  
};
  
  return (
    <>
    <div className={`w-96 hidden  lg:flex lg:flex-col  rounded-3xl border border-slate-300 bg-white p-6 shadow-xl" ${className}`}>
      <div className="mb-6 flex items-center   justify-start">
        <h2 className="text-3xl text-center font-bold">
          Create conversation
        </h2>

      </div>

      <input  // input form for searching users
        placeholder="Search users..."
        className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

     


      {isLoading  && (
        <p>Loading Users</p>
      )}


       {isError  && (
        <p>Error fetching Users</p>
      )}

      <div className="space-y-5">
       {filteredUsers.map((user) => (
    <UserCard
      key={user.id}
      name={user.username}
      profile_image={user.profile_image}
      onSelectUserId={() => HandleUserId(user.id)}
    />
  ))}

        {success && <p>{success}</p>}
        {userError && <p>{userError}</p>}

        {error && <p>{error}</p>}
        
      </div>


        <button 
          className="mt-8 w-full rounded-2xl bg-blue-500 py-4 font-semibold text-white cursor-pointer"
          onClick={HandleCreateConversation}>
            Start chat
        </button>

    </div>
    </>
  );
}

function UserCard({name, profile_image, onSelectUserId}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={profile_image}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>
          <h3 className="font-medium">
            {name}
          </h3>

          <p className="text-blue-500 text-sm">
            Online
          </p>
        </div>
      </div>

      <input
        type="radio"
        name="user"
        onChange={onSelectUserId}
      />
    </div>
  );
}

export default CreateConversationModal