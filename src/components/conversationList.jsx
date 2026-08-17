import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getConversationList from "../services/conversationList";
import { useAuthContext } from "../context/useAuthContext";
import markSeen from "../services/markSeen";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function ConversationList() {

  const { accessToken, userId } = useAuthContext();
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [selectedConvoId, setSelectedConvoId] = useState("")
  const navigate = useNavigate()

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
      markSeenMutation.mutate(conversationId)
      setSelectedConvoId(conversationId)
      navigate(`/conversations/${conversationId}`);
      setSearch("")

    }


    const conversations = data?.conversations || []
    
    const filteredConversations = conversations.filter((convo) => {
        const otherUser =
             convo.user1.id === userId ? convo.user2: convo.user1;
        return otherUser?.username?.toLowerCase().includes(search.toLowerCase()) 

      })


  if (isLoading) {
    return <div>Loading conversations...</div>;
  }




  if (isError) {
    return <div>Error fetching conversations</div>;
  }


  return (
    <section className="w-96  sm:border-0 lg:w-96 lg:border-r sm:p-0 border-slate-300 bg-white lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Chats
        </h1>

        <button className="rounded-xl mt-2 lg:mt-0  bg-purple-100 p-3 text-purple-600">
          ✏️
        </button>
      </div>

       <input  // input form for searching users
        placeholder="Search users..."
        className="mb-6 w-full rounded-xl border border-slate-300 px-4 py-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      <div className="space-y-3">
        
        {data?.conversations.length === 0 &&  (
          <p className="text-center text-slate-400 mt-6">No conversations are found!</p>
        )}


     {filteredConversations.map((conversation) => {

       const otherUser =
       conversation.user1.id === userId ? conversation.user2: conversation.user1;

        return (
          <ConversationCard
            key={conversation.id}
            name={otherUser.username}
            profileImage={otherUser.profile_image}
            user={conversation.messages?.[0]?.sender?.username}
            lastText={conversation.messages?.[0]?.text ?? "No messages yet"}
            onClick={ ()=> HandleClick(conversation.id)}
            selectedId={selectedConvoId}
            id={conversation.id}
            
          />
      );
    })}




      </div>
    </section>
  );
}

function ConversationCard({id, selectedId, name, user, profileImage, lastText, onClick }) {
  const isActive = selectedId === id;   // active is set to selectedConvoId,  id is the default id of the conversation
  return (
    <div
    onClick={onClick}
    className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 transition ${
      isActive ? "bg-green-100" : "hover:bg-gray-50"
    }`}
    >

      <div className="flex gap-3">
        <img
          src={profileImage}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold">
            {name}
          </h3>

          <p className="text-sm text-gray-500">
            {user && `${user}: `}{lastText}
          </p>
        </div>
      </div>

      {/* <span className="rounded-full bg-indigo-500 px-2 py-1 text-xs text-white"> /!! Use SEEN
        2
      </span> */}
    </div>
  );
}