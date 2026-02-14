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
${tw`flex flex-row justify-between items-center px-4 py-3`};
  background-color: var(--black-pearl);
`;

export const StyledDateTime = styled.span`
${tw`self-start text-sm font-normal`};
  color: var(--seren-setting);
`;

export const StyledTotalTimeContainer = styled.div`
  ${tw`self-start`};
  color: var(--seren-setting);

  span {
    ${tw`text-sm font-normal`}; 
  }

  span:nth-child(2) {
    margin-left: 8px;
    ${tw`text-base font-medium`};
  }
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
  flex: 1 1 auto;
  min-width: 0;
  @media (max-width: 767px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    flex-direction: column;
  }
  ${tw`flex flex-row justify-start`};
`;

export const StyledExtraInfoContainer = styled.div`
  width: auto;
  margin-left: auto;
  gap: 0;
  justify-content: flex-end;

  .task-meta-item {
    min-height: 34px;
    padding: 0 14px;
    border-left: 1px dotted #2f4148;
    display: flex;
    align-items: center;
  }

  @media (max-width: 767px) {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
    padding-top: 6px;
    flex-wrap: wrap;

    .task-meta-item {
      border-left: none;
      padding: 0 8px 0 0;
    }
  }
  @media (max-width: 600px) {
    padding: 6px 0;
  }
  ${tw`flex flex-row items-center`};
`;

export const StyledTaskInputContainer = styled.div`
  width: 100%;

  @media (max-width: 1425px) {
    width: 100%;
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
  width: auto;
  flex-shrink: 0;

  .tag-select-text {
    font-size: 0.75rem;
    line-height: 1.2;
    color: #aebdc5;
    background: #0d161b;
    border: none;
    border-radius: 2px;
    min-width: 0;
    max-width: none;
    padding: 4px 12px;
    max-height: none;
  }

  @media (max-width: 767px) {
    width: auto;
  }
  @media (max-width: 600px) {
    align-self: unset;
    width: unset;
  }
`;

export const StyledTimeContainer = styled.div`
  width: auto;
  color: var(--seren-setting);
  flex-shrink: 0;
  ${tw`flex flex-row items-center`};
  gap: 2px;

  .start-time,
  .end-time {
    margin: 0;
    white-space: nowrap;
  }

  .start-time {
    margin-right: 8px;
  }

  .end-time {
    margin-left: 8px;
  }

  span {
    ${tw`text-xs sm:text-sm`};
  }

  @media (max-width: 1425px) {
    width: auto;
  }

  @media (max-width: 1125px) {
    width: auto;
  }

  @media (max-width: 767px) {
    width: auto;
  }

  @media (max-width: 614px) {
    width: auto;
  }

  @media (max-width: 525px) {
    width: auto;
  }

  @media (max-width: 360px) {
    width: auto;
  }

`;

export const StyledTimeDifferenceContainer = styled.span`
  width: auto;
  flex-shrink: 0;
  ${tw`text-xl font-bold`};

  @media (max-width: 614px) {
    width: auto;
  }

  display: inline-block;
  color: #d8e2e8;
`;

export const StyledButtonContainer = styled.div`
  width: auto;
  flex-shrink: 0;

  @media (min-width: 600px) and (max-width: 767px) {
    width: auto;
  }

  button {
    background-color: transparent;
    color: #d8e2e8;
    border: none;
    border-radius: 5px;
    padding: 5px;

    svg {
      font-size: 0.95rem;
    }

    &:hover {
      color: #ffffff;
    }
  }
`;
