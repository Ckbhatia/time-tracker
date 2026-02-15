import tw, { styled } from "twin.macro";

export const StyledHeader = styled.header`
  ${tw`w-full h-14`}
  background-color: var(--black-pearl);
  padding: 0 30px;
`;

export const StyledMainContainer = styled.div`
  ${tw`h-full flex items-center justify-between`}
`;

export const StyledMenuContainer = styled.div`
  ${tw`relative`}
`;

export const StyledLogoButton = styled.button`
  ${tw`text-white text-lg font-bold`}
  background: transparent;
  border: none;
  cursor: pointer;
  letter-spacing: 1px;

  &:focus-visible {
    outline: 2px solid #9fd2ff;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const StyledAvatarButton = styled.button`
  ${tw`flex items-center justify-center text-sm font-bold text-white`}
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background-color: #46b450;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #9fd2ff;
    outline-offset: 2px;
  }
`;

export const StyledDropdown = styled.div`
  ${tw`absolute right-0`}
  top: 40px;
  min-width: 170px;
  background-color: var(--black-pearl);
  border: 1px solid #24343d;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  z-index: 20;
`;

export const StyledDropdownButton = styled.button`
  ${tw`w-full text-left text-sm text-white`}
  background: transparent;
  border: none;
  padding: 12px 14px;
  cursor: pointer;

  &:hover {
    background-color: #1b252a;
  }
`;
