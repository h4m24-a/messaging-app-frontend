import Navigation from "../components/navigation";
import ConversationList from "../components/conversationList";
import ChatWindow from "../components/chatWindow";
import NewConversationModal from "../components/NewConversationModal";

export default function Homepage() {
  return (
    <div className="flex h-screen bg-slate-100 font-PlusJakarta p-8">
      <div className="flex flex-1 overflow-hidden rounded-3xl   bg-white shadow-xl">
        <Navigation />
        <ConversationList />
        <ChatWindow />
      </div>

      <div className="ml-8">
        <NewConversationModal />
      </div>
    </div>
  );
}