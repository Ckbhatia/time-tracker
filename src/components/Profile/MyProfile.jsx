import React from "react";
import Header from "../Common/Header";
import { AuthContext } from "../../Context/AuthContext";
import {
  StyledAvatar,
  StyledCard,
  StyledCardText,
  StyledCardTitle,
  StyledLabel,
  StyledPage,
  StyledTitle,
  StyledValue,
} from "./MyProfile.styles";

const getDisplayName = (userInfo) => {
  if (!userInfo) return "User";

  return (
    userInfo.name ||
    userInfo.username ||
    (userInfo.email ? userInfo.email.split("@")[0] : "User")
  );
};

const getAvatarInitials = (userInfo) => {
  const displayName = getDisplayName(userInfo).trim();

  if (!displayName) return "U";

  const words = displayName.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
};

const MyProfile = () => {
  const { userInfo } = React.useContext(AuthContext);
  const name = getDisplayName(userInfo);
  const email = userInfo?.email || "N/A";

  return (
    <>
      <Header />
      <StyledPage>
        <StyledTitle>My profile</StyledTitle>
        <StyledCard>
          <StyledCardTitle>Personal info</StyledCardTitle>
          <StyledCardText>
            Your log-in credentials and the name that is displayed in reports.
          </StyledCardText>

          <StyledAvatar>{getAvatarInitials(userInfo)}</StyledAvatar>

          <StyledLabel>Name</StyledLabel>
          <StyledValue>{name}</StyledValue>

          <StyledLabel>Email</StyledLabel>
          <StyledValue>{email}</StyledValue>
        </StyledCard>
      </StyledPage>
    </>
  );
};

export default MyProfile;
