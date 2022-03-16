import tw, { styled } from "twin.macro";

export const StyledHeading = styled.h2`
  ${tw`text-2xl font-bold`}
  padding-bottom: 20px;
`;

export const StyledInput = styled.input`
  ${tw`w-full p-2 my-4 border border-gray-400 rounded`}
  background-color: #13191b;
  outline: none;
`;

export const StyledButton = styled.button`
  ${tw`w-full p-2 border border-gray-400 rounded`}
  background-color: #080d0f;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #10181b;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #414e53;
  }
`;