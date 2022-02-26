import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  StyledActionContainer,
  StyledButton,
  StyledPageShowContainer,
  StyledPagination,
} from "./Pagination.styles";

const Pagination = ({offset = 0, limit = 0, totalItems = 0, onClickNext, onClickPrev}) => {
  const start = offset + 1;
  const end = offset + limit > totalItems ? totalItems : offset + limit;
  return (
    <StyledPagination>
      <StyledActionContainer>
        <StyledButton disabled={offset === 0} onClick={onClickPrev}>
          <HiChevronLeft />
        </StyledButton>
        <StyledPageShowContainer>
          <span>{`${start}-${end} of ${totalItems}`}</span>
        </StyledPageShowContainer>
        <StyledButton disabled={end === totalItems} onClick={onClickNext}>
          <HiChevronRight />
        </StyledButton>
      </StyledActionContainer>
    </StyledPagination>
  );
};

export default Pagination;
