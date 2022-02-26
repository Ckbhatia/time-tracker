import tw, { styled } from 'twin.macro';

export const StyledPagination = styled.div`
  ${tw`flex items-center`}
`;

export const StyledActionContainer = styled.div`
  ${tw`flex items-center text-white`}
  cursor: pointer;
  height: 40px;
`;

export const StyledPageShowContainer = styled.div`
  ${tw`flex items-center border-t border-b border-black py-1 px-2`}
  height: inherit;
  cursor: default;
  background-color: var(--main-dark-cyan);
 
  span {
    ${tw` text-sm text-white font-normal`}
  }
`;

export const StyledButton = styled.button`
  ${tw`flex items-center justify-center border border-black py-1 px-2 ease-out duration-300`}
  height: inherit;
  width: 38px;
  &:hover {
    background-color: var(--black-pearl);
  }
  &:disabled {
    cursor: default;
    background-color: var(--main-dark-cyan);
  }
`;

