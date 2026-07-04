const deleteMessage = async (token, conversationId, messageId) => {
  const response = await fetch(`messaging-app-backend-production-b49f.up.railway.app/conversations/${conversationId}/messages/${messageId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete message');
  }

  return {
    status: response.status,
    data
  };
} 


export default deleteMessage