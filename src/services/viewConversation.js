const viewConversation = async (token, conversationId) => {
  const response = await fetch(`https://messaging-app-backend-production-b49f.up.railway.app/conversations/${conversationId}/messages`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

   if (!response.ok) {
    const error = new Error('Failed to fetch conversation');
    error.status = response.status;
    throw error;
  }

  const conversation = await response.json(); // parses it into a JavaScript object 
  return conversation;

}


export default viewConversation;