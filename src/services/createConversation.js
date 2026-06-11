const createConversation = async (token, userBId ) => {
  const response = await fetch("http://localhost:3000/conversations/create", {
    method: 'POST',
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userBId })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};




export default createConversation;