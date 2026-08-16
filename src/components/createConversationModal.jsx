import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../context/useAuthContext";
import getAllUsers from "../services/allUsers";
import createConversation from "../services/createConversation";
import { useState } from "react";

const CreateConversationModal = ({ className = "" }) => {
  const { accessToken } = useAuthContext();
  const queryClient = useQueryClient();

  const [userBId, setUserBId] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(accessToken),
    enabled: !!accessToken,
  });

  const users = data?.users || [];

  const filteredUsers = users.filter((user) =>
    user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const createConversationMutation = useMutation({
    mutationFn: () => createConversation(accessToken, userBId),

    onSuccess: async (response) => {
      setSuccess(response.message || "Conversation created");
      setError("");
      setUserError("");
      setUserBId("");
      setSearch("");

      // Tell React Query that the conversation list is stale.
      // The active conversation-list query will refetch.
      await queryClient.refetchQueries({
        queryKey: ["conversations"],
      });
    },

    onError: (error) => {
      setError(error.message || "Failed to create conversation");
      setUserBId("");
      setUserError("");
      setSuccess("");
    },
  });

  const handleCreateConversation = () => {
    if (!userBId) {
      setUserError("Select a user");
      return;
    }

    setSuccess("");
    setError("");
    setUserError("");

    createConversationMutation.mutate();
  };

  const handleUserId = (userId) => {
    setUserBId(userId);
  };

  return (
    <div
      className={`w-96 hidden lg:flex lg:flex-col rounded-3xl border border-slate-300 bg-white p-6 shadow-xl ${className}`}
    >
      <div className="mb-6 flex items-center justify-start">
        <h2 className="text-3xl text-center font-bold">
          Create conversation
        </h2>
      </div>

      <input
        placeholder="Search users..."
        className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading && <p>Loading Users</p>}

      {isError && <p>Error fetching Users</p>}

      <div className="space-y-5">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            name={user.username}
            profile_image={user.profile_image}
            onSelectUserId={() => handleUserId(user.id)}
          />
        ))}

        {success && <p>{success}</p>}
        {userError && <p>{userError}</p>}
        {error && <p>{error}</p>}
      </div>

      <button
        className="mt-8 w-full rounded-2xl bg-blue-500 py-4 font-semibold text-white cursor-pointer disabled:opacity-50"
        onClick={handleCreateConversation}
        disabled={createConversationMutation.isPending}
      >
        {createConversationMutation.isPending
          ? "Creating..."
          : "Start chat"}
      </button>
    </div>
  );
};

function UserCard({ name, profile_image, onSelectUserId }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={profile_image}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>
          <h3 className="font-medium">{name}</h3>

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

export default CreateConversationModal;