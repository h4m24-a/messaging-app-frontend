const getConversationList = async (token) => {
  const response = await fetch('https://messaging-app-backend-production-b49f.up.railway.app/conversations', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = new Error('Failed to fetch conversation list');
    error.status = response.status;
    throw error;
  }

  const conversations = await response.json(); // parses it into a JavaScript object 
  return conversations;

};

export default getConversationList;