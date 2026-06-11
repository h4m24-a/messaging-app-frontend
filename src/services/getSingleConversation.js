const getSingleConversation = async (token, conversationId) => {
  const response = await fetch(`http://localhost:3000/conversations/${conversationId}`, {
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