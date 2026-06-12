const deleteMessage = async (token, conversationId, messageId) => {
  const response = await fetch(`http://localhost:3000/conversations/${conversationId}/messages/${messageId}`, {
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