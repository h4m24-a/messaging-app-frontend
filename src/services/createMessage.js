const createMessage = async (token, conversationId, message) => {
  const response = await fetch(`messaging-app-backend-production-b49f.up.railway.app/conversations/${conversationId}/messages`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });

    const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return {
    status: response.status,
    data
  };

}


export default createMessage