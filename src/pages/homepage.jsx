import Navigation from "../components/navigation";
import ConversationList from "../components/conversationList";
import ChatWindow from "../components/chatWindow";
import CreateConversationModal from "../components/createConversationModal";
import { useState } from "react";

export default function Homepage() {

  const [activeConversationId, setActiveConversationId] = useState(null)

  return (
    <div className="flex h-screen bg-slate-100 font-PlusJakarta p-8">
      <div className="flex flex-1 overflow-hidden rounded-3xl   bg-white shadow-xl">
        <Navigation />
        <ConversationList
          activeId={activeConversationId}
          onSelectConversation={setActiveConversationId}
        
        />
        <ChatWindow key={activeConversationId} conversationId={activeConversationId} />
      </div>

      <div className="ml-8">
        <CreateConversationModal />
      </div>
    </div>
  );
}