import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../context/useAuthContext";
import viewConversation from "../services/viewConversation";
import createMessage from "../services/createMessage";
import updateMessage from "../services/updateMessage";
import { useState, useEffect, Fragment } from "react";

export default function ChatWindow({ conversationId }) {

  const queryClient = useQueryClient()

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("")
  const [messageValidationError, setMessageValidationError] = useState("")

  const [updatedMessage, setUpdatedMessage] = useState("");
  const [updatedMessageError, setUpdatedMessageError] = useState("")
  const [updatedMessageValidationError, setUpdatedMessageValidationError] = useState("")

  const [selectMessageId, setSelectMessageId] = useState()

  const [showForm, setShowForm] = useState(false)


const { accessToken, userId } = useAuthContext();


  const {data, isLoading, isError } = useQuery({
    queryKey: ["conversation"],
    queryFn: () => viewConversation(accessToken, conversationId ),
    enabled: !!accessToken && !!conversationId
  })

    useEffect(() => {
    // clear updatedComment input when selected id changes
    setUpdatedMessage("")
    setUpdatedMessageError("")
    setUpdatedMessageValidationError("")
  }, [selectMessageId])  // This hook runs whenever selectCommentId changes
  



  // Populate input form with comment for update form
  useEffect(() => {
    const selectedMessage = data?.conversation?.messages.find(msg => msg.id === selectMessageId);
    
    if (selectedMessage) {
      setUpdatedMessage(selectedMessage.text);  // Populate form with selected comment's content
    } else {
      setUpdatedMessage("")
    }
  }, [selectMessageId, data])


  const convo = data?.conversation

  const otherUser = convo?.user1.id === userId  ? convo?.user2 : convo?.user1;


  const HandlePostMessage = async (e) => {
    try {
      e.preventDefault()
  
      const response = await createMessage(accessToken, conversationId, message)
  
      // Validation errors
      if (response.status === 400) {
  
      const messageErr = {}
  
      // Convert error into an object
      response.data.errors.forEach(err => {
        messageErr[err.path] = err.msg
      })
  
      setMessageValidationError(messageErr)
      setMessage("")
      setMessageError("")
      return
    }
  
    if (response) {
      setMessageError("")
      setMessage("")
      setMessageValidationError("")
      queryClient.invalidateQueries({ queryKey: ['conversation']})
    }
      
    } catch (error) {
      setMessageError(error.message)
    }
  }



  // Updating message
  const HandlePutMessage = async (e, messageId) => {
    try {
      e.preventDefault()
  
      const response = await updateMessage(accessToken, conversationId, updatedMessage, messageId)
  
      // Validation errors
      if (response.status === 400) {
  
      const updateMessageErr = {}
  
      // Convert error into an object
      response.data.errors.forEach(err => {
        updateMessageErr[err.path] = err.msg
      })
  
      setMessageValidationError(updateMessageErr)
      setUpdatedMessage("")
      setUpdatedMessageError("")
      queryClient.invalidateQueries({ queryKey: ['conversation']})
    }
    
    if (response) {
      setUpdatedMessageError("")
      setUpdatedMessage("")
      setMessageValidationError("")
      setShowForm(!showForm)
      queryClient.invalidateQueries({ queryKey: ['conversation']})
    }
      
    } catch (error) {
      setUpdatedMessageError(error.message)
    }
  }


  
// get the id of selected message and use it to display the update form.
  const HandleSelectMessageId = (messageId) => {
    setSelectMessageId(messageId)
    setShowForm(!showForm)    // flips value when clicked to hide and display form
    setUpdatedMessageError("");
    setUpdatedMessageValidationError("")
  }


  

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
            <Fragment key={msg.id}>
              <MessageBubble
                message={msg.text}
                incoming={incoming}
                seen={msg.seen}
              />

              {msg.sender.id === userId && (
                <div className=" flex flex-row justify-end items-center  gap-3">
                  <button
                    type="button"
                    // onClick={() => HandleDeleteComment(msg.id)}
                    className="h-8 text-xs cursor-pointer max-w-fit w-fit rounded-md outline-neutral-950 outline px-5 font-medium text-black transition active:scale-110"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => HandleSelectMessageId(msg.id)}
                    className="h-8 text-xs cursor-pointer max-w-fit w-fit rounded-md bg-neutral-950 px-5 font-medium text-white transition active:scale-110"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </div>
              )}


              

              {showForm  && selectMessageId === msg.id && (  // Update Message input
                <footer className="border-t border-slate-300 p-6">
                <form 
                onSubmit={(e) => HandlePutMessage(e, msg.id)}
                >
                <div className="flex items-center gap-4 rounded-2xl border border-slate-500 px-4 py-3">
                  <input
                    placeholder="Type a message..."
                    className="flex-1 outline-none"
                    name="updatedMessage"
                    type="text"
                    value={updatedMessage}
                    onChange={(e) => setUpdatedMessage(e.target.value)}
                    required
                    />

                  <button type="submit" className="rounded-lg bg-blue-600 p-3 text-white">
                    <i className="fa-solid fa-paper-plane fa-lg cursor-pointer"></i>
                  </button>
                
              </div>
                </form>
                {updatedMessageError && (
                  <p> {updatedMessageError} </p>
                )}

                {updatedMessageValidationError.message && (
                  <p> {updatedMessageValidationError.message} </p>
                )}
            </footer>

              )}
        
            </Fragment>
          );
        })}

      </div>
          </>

      {/* Input */}
      <footer className="border-t border-slate-300 p-6">
          <form 
          onSubmit={(e) => HandlePostMessage(e)}
          >
        <div className="flex items-center gap-4 rounded-2xl border border-slate-300 px-4 py-3">

            <input
              placeholder="Type a message..."
              className="flex-1 outline-none"
              name="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              />

            <button type="submit" className="rounded-lg bg-blue-600 p-3 text-white">
              <i className="fa-solid fa-paper-plane fa-lg cursor-pointer"></i>
            </button>
          
        </div>
          </form>
          {messageError && (
            <p> {messageError} </p>
          )}

           {messageValidationError.message && (
            <p> {messageValidationError.message} </p>
          )}
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