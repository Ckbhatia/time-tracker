import tw, { styled } from "twin.macro";

export const StyledSection = styled.section`
  ${tw`flex flex-col items-center justify-center h-screen`}
  background-color: #253236;
`;

export const StyledContainer = styled.div`
  width: 350px;
  background-color: var(--black-pearl);
  border-radius: 2px;
  box-shadow: 0 0 20px rgb(0 0 0 / 10%);
`;

export const StyledFormContainer = styled.form`
  padding: 35px 25px 0 25px;
`;

export const StyledInputContainer = styled.div`
  ${tw`mb-6`};
`;

export const StyledInput = styled.input`
  ${tw`
    w-full
    rounded-md
    border border-gray-700
    py-3
    px-5
    outline-none
    focus-visible:shadow-none
    text-white
  `}
  background-color: var(--black-pearl);

`;

export const StyledSubmit = styled.input`
  ${tw`
    w-full
    rounded-md
    border border-gray-700
    py-3
    px-5
    text-base text-white
    cursor-pointer
    hover:bg-opacity-90
    transition
    text-base text-white
  `}
  background-color: var(--main-dark-cyan);
  transition: all 0.2s ease-in-out;
  &:hover { 
    background-color: #253235;
  }
  
  &:disabled { 
    cursor: not-allowed;
    background-color: #414e53;
  }
`;

export const StyledButtonContainer = styled.div`
  ${tw`w-full 
    border border-gray-700
  `}
  padding-top: 2px;
  background-color: var(--main-dark-cyan);
  text-align: center;
  height: 50px;
`;

export const StyledExtraActionContainer = styled.div`
  text-align: center;
`

export const StyledLinkContainer = styled.span`
  ${tw`text-base text-white pt-2 pb-6`}
  display: inline-block;

  a {
    color: #3f00ff;
    margin-left: 8px;
  }
`;