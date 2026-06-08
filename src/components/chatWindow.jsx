import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../context/useAuthContext";
import viewConversation from "../services/viewConversation";

export default function ChatWindow({ conversationId }) {


const { accessToken, userId } = useAuthContext();


  const {data, isLoading, isError } = useQuery({
    queryKey: ["conversation"],
    queryFn: () => viewConversation(accessToken, conversationId ),
    enabled: !!accessToken && !!conversationId
  })


  const convo = data?.conversation

  const otherUser = convo?.user1.id === userId  ? convo?.user2 : convo?.user1;


  

  if (!conversationId) {    // show this when user hasn't selected a conversation
     return <div className="flex-1 flex items-center justify-center text-slate-400">Select a chat to begin</div>;
  }

  return (
    <section className="flex flex-1 flex-col  bg-white">
      {/* Header */}

      
    
            <>
            <header className="flex items-center justify-between border-b border-slate-300 p-6">
        <div className="flex items-center gap-3">
          
          <img
            src={otherUser?.profile_image}
            alt=""
            className="h-12 w-12 rounded-full"
          />

          <div>
            <h2 className="font-semibold">
              {otherUser?.username}
            </h2>

            <p className="text-green-500">
              Online
            </p>
          </div>
        </div>

    
      </header>

    
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {isLoading && <div>Loading conversation...</div>}
        {isError && <div>Error fetching conversation...</div>}

       {data?.conversation.messages.length === 0 && (
          <p className="text-center text-gray-400">Start Messaging!</p>
        )}

        {data?.conversation?.messages.map((msg) => {
          const incoming = msg.sender.id !== userId;
          return (

            <MessageBubble
            key={msg.id}
            message={msg.text}
            incoming={incoming} 
            seen={msg.seen}
            />
            
          )

      })}
      </div>
          </>

      {/* Input */}
      <footer className="border-t border-slate-300 p-6">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-300 px-4 py-3">
          <input
            placeholder="Type a message..."
            className="flex-1 outline-none"
          />

          <button className="rounded-lg bg-blue-600 p-3 text-white">
            <i className="fa-solid fa-paper-plane fa-lg cursor-pointer"></i>
          </button>
        </div>
      </footer>
    </section>
  );
}

function MessageBubble({ message, incoming, seen }) {
  return (
    <div
      className={`flex ${
        incoming
          ? "justify-start"
          : "justify-end"
      }`}
    >
      <div
        className={`max-w-sm rounded-2xl px-5 py-3 ${
          incoming
            ? "bg-gray-100"
            : "bg-blue-100"
        }`}
      >
        {message}

      </div>
      
{!incoming && seen && (
        <p className="ml-2 self-end text-xs text-gray-500">
          Seen
        </p>
      )}
    </div>
  );
}