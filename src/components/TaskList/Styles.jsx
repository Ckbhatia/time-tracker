import tw, { styled } from "twin.macro";

export const StyledMainContainer = styled.div`
  ${tw`px-4 py-4`};
`;
  
export const StyledListContainer = styled.ul`
  list-style: none;
  border: 1px solid black;
`;

export const StyledTaskContainer = styled.div`
  ${tw`flex content-start items-center border-b-2 border-black p-3.5 w-full`};
  background-color: var(--main-dark-cyan);
  transition: all .2s ease-in-out;

  &:hover {
    box-shadow: 0 0 20px rgb(0 0 0 / 80%);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledTaskInputContainer = styled.div`
  width: 50%;

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
`;

export const StyledTimeContainer = styled.div`
  width: 15%;
  color: var(--seren-setting);
`;

export const StyledTimeDifferenceContainer = styled.span`
  width: 5%;
  display: inline-block;
  color: var(--seren-setting);
`;

export const StyledButtonContainer = styled.div`
  width: 5%;  
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