import { useQuery , useQueryClient} from "@tanstack/react-query";
import { useAuthContext } from "../context/useAuthContext";
import getAllUsers from "../services/allUsers";
import createConversation from "../services/createConversation";
import { useState } from "react";

export default function CreateConversationModal() {

  
  const { accessToken } = useAuthContext();

  const queryClient = useQueryClient()

  const [userBId, setUserBId] = useState();
  const [success, setSuccess] = useState("");
  const [error, setError] =  useState("")
  const [userError, setUserError] = useState("")



  const{ data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(accessToken),
    enabled: !!accessToken
  })


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
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
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
    <div className="w-96 rounded-3xl border border-slate-300 bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          Create conversation
        </h2>

        <button>✕</button>
      </div>

      <input
        placeholder="Search users..."
        className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3"
      />

      {isLoading  && (
        <p>Loading Users</p>
      )}


       {isError  && (
        <p>Error fetching Users</p>
      )}

      <div className="space-y-5">
       {data?.users.map((user) => (

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