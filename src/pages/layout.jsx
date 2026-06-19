import Navigation from "../components/navigation";
import ConversationList from "../components/conversationList";
import ChatWindow from "../components/chatWindow";
import CreateConversationModal from "../components/createConversationModal";

export default function Layout() {

  return (
    <div className="flex h-screen lg:bg-slate-100 font-PlusJakarta p-8">
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:shadow-xl">
        <Navigation />

        <ConversationList />

        <ChatWindow />
      </div>

      <div className="ml-8">
        <CreateConversationModal />
      </div>
    </div>
  );
}