import tw, { styled } from "twin.macro";

export const StyledMainContainer = styled.div`
  ${tw`px-4 py-4`};
`;
  
export const StyledListContainer = styled.ul`
  list-style: none;
  border: 1px solid black;
  margin-bottom: 15px;
  position: relative;
`;

export const StyledHeaderContainer = styled.div`
${tw`flex flex-col items-center px-4 py-3`};
  background-color: var(--black-pearl);
`;

export const StyledDateTime = styled.span`
${tw`self-start text-sm font-normal`};
  color: var(--seren-setting);
`;

export const StyledTaskContainer = styled.div`
  ${tw`flex content-start items-center border-b-2 border-black p-2.5 w-full`};
  background-color: var(--main-dark-cyan);
  transition: all .2s ease-in-out;

  &:hover {
    box-shadow: 0 0 20px rgb(0 0 0 / 80%);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledTaskMainInfoContainer = styled.div`
  width: 55%;
  @media (max-width: 767px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    flex-direction: column;
  }
  ${tw`flex flex-row`};
`;
export const StyledExtraInfoContainer = styled.div`
  width: 45%;

  @media (max-width: 767px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    padding: 6px 0;
  }
  ${tw`flex flex-row items-center`};
`;

export const StyledTaskInputContainer = styled.div`
  width: 80%;

  @media (max-width: 1425px) {
    width: 65%;
  }
  ${tw`flex flex-col`};

  input {
    ${tw`text-base font-normal self-start px-3 py-2 max-w-max`};
    background-color: var(--main-dark-cyan);
    color: var(--seren-setting);
    border: 1px solid transparent;

    &:focus-visible, :hover {
      outline: none;
      border: 1px solid black;
    }
  }
`;

export const StyledTagContainer = styled.div`
  width: 10%;
  @media (max-width: 767px) {
    width: 35%;
  }
  @media (max-width: 600px) {
    align-self: flex-start;
    width: unset;
  }
`;

export const StyledTimeContainer = styled.div`
  width: 45%;
  color: var(--seren-setting);

  span {
    ${tw`text-xs sm:text-sm`};
  }

  @media (max-width: 1425px) {
    width: 65%;
  }

  @media (max-width: 1125px) {
    width: 75%;
  }

  @media (max-width: 767px) {
    width: 35%;
  }

  @media (max-width: 614px) {
    width: 45%;
  }

  @media (max-width: 525px) {
    width: 55%;
  }

  @media (max-width: 360px) {
    width: 70%;
  }

`;

export const StyledTimeDifferenceContainer = styled.span`
  width: 15%;
  ${tw`text-xs sm:text-sm`};

  @media (max-width: 614px) {
    width: 25%;
  }

  display: inline-block;
  color: var(--seren-setting);
`;

export const StyledButtonContainer = styled.div`
  width: 10%;

  @media (min-width: 600px) and (max-width: 767px) {
    width: 15%;
  }

  button {
    background-color: transparent;
    color: var(--seren-setting);
    border: none;
    border-radius: 5px;
    padding: 5px;

    &:hover {
      color: #8f8f8f;
    }
  }
`;