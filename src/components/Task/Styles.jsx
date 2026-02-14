import tw, { styled } from "twin.macro";

export const StyledMainTaskContainer = styled.div`
  padding: 10px 15px;
  background-color: #253237;
`;

export const StyledTaskContainer = styled.div`
  border: 1px solid black;
  background-color: var(--main-dark-cyan);
  ${tw`flex p-2 w-full`};
  align-items: center;
  gap: 12px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
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
