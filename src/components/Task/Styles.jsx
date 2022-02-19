import tw, { styled } from "twin.macro";

export const StyledTaskContainer = styled.div`
  border: 1px solid black;
  background-color: var(--main-dark-cyan);
  ${tw`flex flex-row flex-wrap content-center p-2`};
`;

export const StyledCreateTaskInput = styled.input`
${tw`text-base font-normal px-3 py-2`};
  padding: 10px 12px;
  width: 100%;
  background-color: var(--main-dark-cyan);
  color: white;
  border: 1px solid transparent;

  &:focus-visible, :hover {
    outline: none;
    border: 1px solid black;
  }
`;