const createMessage = async (token, conversationId, message) => {
  const response = await fetch(`http://localhost:3000/conversations/${conversationId}/messages`, {
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