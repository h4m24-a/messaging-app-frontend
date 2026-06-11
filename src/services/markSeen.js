const markSeen = async (token, conversationId) => {
  const response = await fetch(`http://localhost:3000/conversations/${conversationId}/messages/seen`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

   if (!response.ok) {
    const error = new Error('Failed to mark message as seen');
    error.status = response.status;
    throw error;
  }

  const data = await response.json(); // parses it into a JavaScript object 
  return data;

}


export default markSeen