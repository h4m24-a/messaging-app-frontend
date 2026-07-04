const getSingleConversation = async (token, conversationId) => {
  const response = await fetch(`https://messaging-app-backend-production-b49f.up.railway.app/conversations/${conversationId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

   const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}


export default getSingleConversation