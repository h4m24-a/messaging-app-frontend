const getConversationList = async (token) => {
  const response = await fetch('http://localhost:3000/conversations', {
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