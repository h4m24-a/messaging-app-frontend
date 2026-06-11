import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getConversationList from "../services/conversationList";
import { useAuthContext } from "../context/useAuthContext";
import markSeen from "../services/markSeen";



export default function ConversationList({onSelectConversation, activeId}) {

  const { accessToken, userId } = useAuthContext();
  const queryClient = useQueryClient()


  const {data, isLoading, isError } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversationList(accessToken),
    enabled: !!accessToken
  })


  
    // Mark message as seen when opening chat
    const markSeenMutation = useMutation({
      mutationFn:(conversationId) => markSeen(accessToken, conversationId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversation']})
      }
    })



    const HandleClick = async (conversationId) => {
      onSelectConversation(conversationId)
      markSeenMutation.mutate(conversationId)

    }



  if (isLoading) {
    return <div>Loading conversations...</div>;
  }




  if (isError) {
    return <div>Error fetching conversations</div>;
  }


  return (
    <section className="w-96 border-r border-slate-300 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Chats
        </h1>

        <button className="rounded-xl bg-purple-100 p-3 text-purple-600">
          ✏️
        </button>
      </div>

      <input
        type="text"
        placeholder="Search conversations"
        className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />

      <div className="space-y-3">

        {data?.conversations.length === 0 &&  (
          <p className=" text-xl text-center mt-6 text-red-500 font-mono">No conversations are found!</p>
        )}


     {data?.conversations.map((conversation) => {

       const otherUser =
       conversation.user1.id === userId
       ? conversation.user2
       : conversation.user1;

        return (
          <ConversationCard
            key={conversation.id}
            name={otherUser.username}
            profileImage={otherUser.profile_image}
            user={conversation.messages?.[0]?.sender?.username}
            lastText={conversation.messages?.[0]?.text ?? "No messages yet"}
            onClick={ ()=> HandleClick(conversation.id)}
            active={activeId === conversation.id}
          />
      );
    })}




      </div>
    </section>
  );
}

function ConversationCard({ active, name, user, profileImage, lastText, onClick, onChange }) {
  return (
    <div
    onClick={onClick}
    onChange={onChange}
    className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 transition ${
      active
      ? "bg-green-100"
      : "hover:bg-gray-50"
    }`}
    >

      <div className="flex gap-3">
        <img
          src={profileImage}
          alt=""
          className="h-12 w-12 rounded-full"
        />

        <div>
          <h3 className="font-semibold">
            {name}
          </h3>

          <p className="text-sm text-gray-500">
           {user}: {lastText}
          </p>
        </div>
      </div>

      {/* <span className="rounded-full bg-indigo-500 px-2 py-1 text-xs text-white"> /!! Use SEEN
        2
      </span> */}
    </div>
  );
}