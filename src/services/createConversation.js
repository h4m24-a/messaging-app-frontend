const createConversation = async (token, userBId ) => {
  const response = await fetch("https://messaging-app-backend-production-b49f.up.railway.app/conversations/create", {
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