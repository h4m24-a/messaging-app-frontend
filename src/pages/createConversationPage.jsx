import Navigation from "../components/navigation";
import CreateConversationModal from "../components/createConversationModal";

const CreateConversationPage = () => {
  return (

    <>
    <div className="flex h-screen bg-white font-PlusJakarta p-8" >

      <div className="flex flex-col w-full lg:flex-row lg:flex-1 lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:shadow-xl">
        <Navigation />
        <CreateConversationModal className="flex! flex-col w-full border-0" />
      </div>
    
      </div>
    </>

  
 
       
)

}

export default CreateConversationPage