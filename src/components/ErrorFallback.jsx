import React from "react";
import { useNavigate } from "react-router-dom";
import tw, { styled } from "twin.macro";
import { routes } from "../constants/routes";

const ErrorFallback = ({ resetErrorBoundary, isAuthenticated }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    resetErrorBoundary();
    isAuthenticated ? navigate(routes.tracker) : navigate(routes.login);
  }
  return (
    <StyledMainContainer>
      <StyledContentContainer>
        <strong>500</strong>
        <p>Something went wrong</p>
        <StyledButton onClick={handleClick}>Go home</StyledButton>
      </StyledContentContainer>
    </StyledMainContainer>
  );
};

export default ErrorFallback;

const StyledMainContainer = styled.main`
  height: 100vh;
  ${tw`flex flex-col items-center justify-center`}
  background-color: var(--main-dark-cyan)
`;
const StyledContentContainer = styled.div`
  text-align: center;
  color: white;
  strong {
    font-size: 82px;
    font-weight: 700;
  }

  p {
    font-size: 24px;
  }
`;

const StyledButton = styled.button`
  padding: 6px 10px;
  border: 1px solid grey;
  border-radius: 3px;
  margin-top: 20px;
`;