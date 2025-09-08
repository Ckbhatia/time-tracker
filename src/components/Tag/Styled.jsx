import { styled } from "twin.macro";

export const StyledMainTagContainer = styled.div`
  .tag-select-text {
    padding: 6px 20px;
    border: 1px solid #737373;
    border-radius: 5px;
    background-color: #12191d;
    font-size: 16px;
    color: #ffffff;
    max-width: 130px;
    min-width: 128px;
    display: inline-block;
    overflow: hidden;
    max-height: 40px;
  }

  &.tag-select-menu {
    position: relative;
    top: 50%;
    left: 50%;
    background-color: #12191d;
    color: #ffffff;
  }
`;
