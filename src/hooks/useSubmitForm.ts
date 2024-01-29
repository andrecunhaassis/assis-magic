import { useState } from "react";
import {
  getUserProfile,
  saveUserProfile,
  updateUserProfile,
} from "@/services/sheets";
import { delay } from "@/utils/date";
import { fetchColorImage, fetchLinks } from "@/utils/fetchUtils";
import { generateBio, generateCompanyAndCategory } from "@/services/gptService";
import {
  InstagramDataProps,
  UserDataProps,
  UserFromSheetProps,
} from "@/interfaces";
import { useInstagramData } from "@/hooks/useInstagramData";

export const useSubmitForm = () => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [userFromSheet, setUserFromSheet] = useState<UserFromSheetProps | null>(
    null
  );
  const [userData, setUserData] = useState<UserDataProps | null>(null);
  const { fetchInstagramData } = useInstagramData();

  const handleSubmit = async (
    username: string,
    userLoaded: UserFromSheetProps | null,
    temporaryUserData: InstagramDataProps | null,
    email: string
  ) => {
    if (!username) return;
    setLoadingStep(1);

    let userDataComplete: UserDataProps = {} as UserDataProps;

    const data = await fetchInstagramData(username);
    if (!data) {
      userDataComplete = {
        ...userDataComplete,
        name: temporaryUserData?.full_name || userFromSheet?.full_name || "",
        bio: userFromSheet?.description_profile || "",
        insta_bio: userFromSheet?.bio_insta || "",
        img:
          temporaryUserData?.profile_pic_url ||
          userFromSheet?.profile_pic_url ||
          "/img/user.png",
        nick: username,
      };
    } else {
      userDataComplete = {
        ...userDataComplete,
        name:
          data?.name ||
          temporaryUserData?.full_name ||
          userFromSheet?.full_name ||
          "",
        bio: userFromSheet?.description_profile || "",
        insta_bio: data?.bio,
        img:
          data?.img ||
          temporaryUserData?.profile_pic_url ||
          userFromSheet?.profile_pic_url ||
          "/img/user.png",
        nick: username,
      };
    }

    const userImage =
      data?.img ||
      temporaryUserData?.profile_pic_url ||
      userLoaded?.profile_pic_url;
    const resultColor = await fetchColorImage(userImage);
    userDataComplete.color = resultColor || "#f07026";

    const links = await fetchLinks(data?.link || "");
    // add links to userDataComplete if exists
    if (links?.links?.length > 0) {
      userDataComplete.links = links.links;
    } else {
      userDataComplete.links = [];
    }

    const filteredLinks = links?.links?.map((link: any) => ({
      href: link.href,
      title: link.title,
    }));

    setLoadingStep(2);
    let finalBio = userLoaded?.description_profile || "";
    let finalCompany = userLoaded?.company_name || null;
    let finalCategory = userLoaded?.business_vertical || "";
    let hasUsageGPT = false;

    if (
      !userLoaded?.description_profile ||
      data?.bio !== userLoaded?.bio_insta
    ) {
      let dataToGenerateBio = {
        ...data,
      };
      if (filteredLinks && filteredLinks.length > 0) {
        dataToGenerateBio.links = filteredLinks;
      } else {
        delete dataToGenerateBio.links;
      }

      // se não tiver nem bio nem links, não gera bio
      if (
        !dataToGenerateBio.bio &&
        (!dataToGenerateBio.links || dataToGenerateBio.links.length === 0)
      ) {
        finalBio = "Profissionalismo, qualidade e agilidade são os meus principais valores. Estou pronto para conversar e impulsionar suas ideias! 🚀";
        hasUsageGPT = false;
      } else {
        try {
          const results = await Promise.allSettled([
            generateBio(JSON.stringify(dataToGenerateBio)),
            generateCompanyAndCategory(JSON.stringify(dataToGenerateBio)),
          ]);

          const bioResult = results[0];
          const companyAndCategoryResult = results[1];

          if (bioResult.status === "fulfilled") {
            finalBio = bioResult.value;
            hasUsageGPT = true;
          }

          if (companyAndCategoryResult.status === "fulfilled") {
            finalCompany = companyAndCategoryResult.value.company;
            finalCategory = companyAndCategoryResult.value.category;
          }

          if (bioResult.status === "rejected") {
            console.error("Erro na geração da bio:", bioResult.reason);
          }
          if (companyAndCategoryResult.status === "rejected") {
            console.error(
              "Erro na geração da empresa e categoria:",
              companyAndCategoryResult.reason
            );
          }
        } catch (error) {
          console.error("Um erro inesperado ocorreu:", error);
        }
      }
    }
    userDataComplete.bio = finalBio;
    userDataComplete.company = finalCompany;
    userDataComplete.category = finalCategory;

    setLoadingStep(3);

    if (userLoaded) {
      await updateUserProfile(
        {
          ...userLoaded,
          description_profile: finalBio,
          bio_insta: data?.bio,
          profile_pic_url: userImage,
          links: links?.links || userLoaded?.links || [],
          secondary_color: resultColor || "#f07026",
          company_name: finalCompany || userLoaded?.full_name,
          business_vertical: finalCategory,
        },
        email,
        hasUsageGPT
      );
    } else {
      await saveUserProfile(userDataComplete);
      const response = await getUserProfile(username);
      setUserFromSheet(response);
    }

    await delay(1500);
    setUserData(userDataComplete);
    setLoadingStep(0);
  };

  return {
    handleSubmit,
    userData,
    loadingStep,
    userFromSheet,
    setUserFromSheet,
  };
};
