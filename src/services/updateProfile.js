const updateProfile = async (token, updatedBio, updatedProfileImage) => {
  const formData = new FormData();

  formData.append("updatedBio", updatedBio);

  if (updatedProfileImage) {
    formData.append("updatedProfileImage", updatedProfileImage);
  }

  const response = await fetch("messaging-app-backend-production-b49f.up.railway.app/api/auth/profile/", {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      
    },
    body: formData,
  });

  return await response.json();
};

export default updateProfile