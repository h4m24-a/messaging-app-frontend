const getProfile = async (token) => {
  const response = await fetch("messaging-app-backend-production-b49f.up.railway.app/api/auth/profile/", {
   
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  

  const data = await response.json();    // parses it into a JavaScript object 
  return data;

}





export default getProfile