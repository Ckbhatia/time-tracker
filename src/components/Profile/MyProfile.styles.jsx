import tw, { styled } from "twin.macro";

export const StyledPage = styled.main`
  min-height: calc(100vh - 56px);
  background-color: #253237;
  padding: 20px;
`;

export const StyledTitle = styled.h1`
  ${tw`text-4xl font-semibold text-white`}
  margin: 0 0 24px;
`;

export const StyledCard = styled.section`
  border: 1px solid #152126;
  background-color: #1d272b;
  padding: 22px;
  color: #ffffff;
`;

export const StyledCardTitle = styled.h2`
  ${tw`text-2xl font-semibold`}
  margin: 0 0 8px;
`;

export const StyledCardText = styled.p`
  ${tw`text-sm`}
  margin: 0 0 22px;
  color: #d2e0e5;
`;

export const StyledAvatar = styled.div`
  ${tw`flex items-center justify-center`}
  width: 96px;
  height: 96px;
  border-radius: 8px;
  background-color: #46b450;
  font-size: 40px;
  color: #ffffff;
  margin-bottom: 26px;
`;

export const StyledLabel = styled.p`
  ${tw`text-sm`}
  margin: 0;
  color: #afc2cb;
`;

export const StyledValue = styled.p`
  ${tw`text-2xl font-semibold`}
  margin: 6px 0 16px;
  color: #ffffff;
`;
