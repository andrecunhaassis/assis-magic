import { Profile } from "@/components/profile";
import { LoadingProgress } from "@/components/loading";
import { InstagramDataProps } from "@/interfaces";
import React, { useState } from "react";
import { ProfileFake } from "@/components/profile-fake";
import {
  getUserProfile,
  saveUserProfile,
  updateUserProfile,
} from "@/services/sheets";
import useSearch from "@/hooks/useSearch";
import { SearchHome } from "@/components/containers/search-home";
import { ScrollingImages } from "@/components/scrolling-images";
import { useSubmitForm } from "@/hooks/useSubmitForm";
import { InstaNotFound } from "@/components/containers/insta-not-found";

export default function Home() {
  const { username, setUsername, people, isStartSearch } = useSearch('');
  const [temporaryUserData, setTemporaryUserData] = useState<InstagramDataProps | null>(null);
  const [email, setEmail] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const { handleSubmit, userData, loadingStep, userFromSheet, setUserFromSheet } = useSubmitForm();
  const [instaNotFound, setInstaNotFound] = useState(false);

  async function verifyUserFromSheet(username: string) {
    if (!username) return;
    setDisableButton(true);

    const response = await getUserProfile(username);
    if (response.error) {
      if(!temporaryUserData) {
        setInstaNotFound(true);
        return;
      }
      handleSubmit(username, null, temporaryUserData, email);
    } else {
      setUserFromSheet(response);
      handleSubmit(username, response, temporaryUserData, email);
    }
    setDisableButton(false);
  }

  if(instaNotFound) {
    return (
      <InstaNotFound />
    )
  }

  if (loadingStep > 0 && !userData) {
    return (
      <div className="flex w-full h-screen items-center justify-center relative">
        <div className="absolute z-10 top-0 left-0 w-full h-full text-white flex items-center justify-center">
          <LoadingProgress
            display={true}
            finished={loadingStep > 2}
            text={
              loadingStep > 2
                ? "Finalizado!"
                : "Criando seu site num passe de mágica..."
            }
          />
        </div>
        <ProfileFake
          name={temporaryUserData?.full_name || "Nome"}
          avatarUrl={temporaryUserData?.profile_pic_url || "/img/user.png"}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#F5F5F5] relative">
      <ScrollingImages
        display={!!userData}
        position="left"
        scrollDirection="up"
      />

      <ScrollingImages
        display={!!userData}
        position="right"
        scrollDirection="down"
      />

      {userData ? (
        <div className="h-full w-full">
          <Profile
            name={userData?.company || userData?.name}
            description={userData?.bio}
            avatarUrl={userData?.img}
            instagramNick={userData?.nick}
            links={userData?.links}
            email={email}
            color={userData?.color || "#f07026"}
            setEmail={setEmail}
            onSubmit={async () => {
              if (email) {
                let result = null;
                if (userFromSheet) {
                  result = await updateUserProfile(userFromSheet, email, false);
                } else {
                  result = await saveUserProfile(userData);
                }
                if (result) {
                  // redirect to new tab https://www.assis.co/baixe-o-app
                  window.open(
                    "https://www.assis.co/baixe-o-app",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }
            }}
          />
        </div>
      ) : (
        <SearchHome
          username={username}
          setUsername={setUsername}
          people={people}
          isStartSearch={isStartSearch}
          loadingStep={loadingStep}
          disableButton={disableButton}
          setTemporaryUserData={setTemporaryUserData}
          verifyUserFromSheet={verifyUserFromSheet}
        />
      )}
    </div>
  );
}
