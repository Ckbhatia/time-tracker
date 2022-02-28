import tw, { styled } from "twin.macro";

export const StyledHeader = styled.header`
  ${tw`w-full h-14`}
  background-color: var(--black-pearl);
  padding: 0 30px;
`;

export const StyledMainContainer = styled.div`
  ${tw`h-full flex  items-center justify-end`}
`;

export const StyledLogOutButton = styled.button`
  ${tw`text-base text-white font-normal`}
`;
