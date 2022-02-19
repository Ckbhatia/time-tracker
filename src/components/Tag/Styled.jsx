import tw, { styled } from "twin.macro";

export const StyledMainTagContainer = styled.div`
  padding: 10px 15px;
`;

export const StyledSelect = styled.select`
  background-color: var(--black-pearl);
  color: var(--seren-setting);
  ${tw`px-2 py-1 rounded-sm`};


  &:hover {
    background-color: #37474f;
  }

  &:focus-visible {
    outline: none;
  }
`;