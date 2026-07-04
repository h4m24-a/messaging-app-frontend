const updateMessage = async (token, conversationId, updatedMessage, messageId) => {
  const response = await fetch(`https://messaging-app-backend-production-b49f.up.railway.app/conversations/${conversationId}/messages/${messageId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ updatedMessage })
  });

    const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update message');
  }

  return {
    status: response.status,
    data
  };

}


export default updateMessage