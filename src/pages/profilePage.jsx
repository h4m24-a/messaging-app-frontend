import Navigation from "../components/navigation";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import getProfile from "../services/getProfile";
import updateProfile from "../services/updateProfile";

const ProfilePage = () => {

  const queryClient = useQueryClient()
  const { accessToken , userId} = useAuthContext();
  const [updatedBio, setUpdatedBio] = useState("");
  const [updatedBioError, setUpdatedBioError] = useState("")

  const [updatedProfileImage, setUpdatedProfileImage] = useState(null)
  const [updatedProfileImageError, setUpdatedProfileImageError] = useState("")


  const {data, isLoading, isError} = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(accessToken),
    enabled: !!accessToken                    // Ensures the query only runs if accessToken exists
  })



  
  // Update profile - mutation

 const updateProfileMutation = useMutation({
  mutationFn: ({ updatedBio, updatedProfileImage }) =>
    updateProfile(accessToken, updatedBio, updatedProfileImage),

  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setUpdatedBio("")
    setUpdatedProfileImage(null)

    if (data?.error) {
      setUpdatedBioError(data.error);
      setUpdatedProfileImageError(data.error);
    } else {
      setUpdatedBioError("");
      setUpdatedProfileImageError("");
    }
  },
});

  const HandleForm = async (e) => {
    e.preventDefault()
    updateProfileMutation.mutate({updatedBio, updatedProfileImage})
  }

  if (isLoading || !data) {
  return <div>Loading Dashboard....</div>
}

if (!userId) {
  return <div>Error when loading profile...</div>
}

if (isError) {
  return <div>Error occurred when loading profile!</div>
}



  return (
    <div className="flex h-screen bg-slate-100 font-PlusJakarta p-8">
      <div className="flex flex-1 overflow-hidden rounded-3xl bg-white shadow-xl">
        <Navigation />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-3xl px-10 py-12">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={data.profile.profile_image}
                  alt="Profile Image"
                  className="h-30 w-30 rounded-full object-cover shadow-lg"
                />

                
              </div>

              <h1 className="mt-6 text-3xl font-bold text-slate-800">
                {data.profile.username}
              </h1>


            </div>

            <div className="mt-8 space-y-8">

              <div>
                <label className="mb-6 block text-center text-sm font-semibold text-slate-700">
                  {data.profile.bio}
                </label>

               <form onSubmit={HandleForm}>
                  <div className="flex flex-col gap-3 rounded-2xl border border-slate-500 p-4">
                    
                    {/* Bio input */}
                    <input
                      placeholder="Add Bio"
                      className="w-full outline-none border-b border-slate-300 pb-2"
                      name="updatedBio"
                      type="text"
                      value={updatedBio}
                      onChange={(e) => setUpdatedBio(e.target.value)}
                      
                    />

                    <div className="flex flex-col lg:flex-row max-w-full  text-center items-center justify-between gap-4">
                    {/* File input row */}
                    <label className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 w-full text-sm text-white hover:bg-slate-700 transition">
                      <input
                        type="file"
                        name="updatedProfileImage"
                        accept="image/*"
                        placeholder="Select Image"
                        onChange={(e) => setUpdatedProfileImage(e.target.files[0])}
                        className="text-xs text-center"
                        />
                      </label>


                      <button
                        type="submit"
                        className="flex-col lg:flex-row rounded-lg w-full bg-blue-600 px-4 py-2 cursor-pointer text-white"
                      >
                        Update Profile
                      </button>
                    </div>

                  </div>
                </form>
                {updatedBioError && (
                  <p> {updatedBioError} </p>

                )}

                {updatedProfileImageError && (
                  <p> {updatedProfileImageError} </p>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;



//TODO Make this page mobile responsive and CreateConversationModel