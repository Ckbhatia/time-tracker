import React from "react";
import { useNavigate } from "react-router-dom";
import {
  StyledHeader,
  StyledLogOutButton,
  StyledMainContainer,
} from "./Header.styles";
import { routes } from "../../constants/routes";
import { AuthContext } from "../../Context/AuthContext";
import { logOut } from "../../utils/auth";

const Header = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = React.useContext(AuthContext);

  const handleLogOut = async () => {
    await logOut()
    await setIsAuthenticated(false);
    navigate(routes.login);
  };
  return (
    <StyledHeader>
      <StyledMainContainer>
        <div>
          <StyledLogOutButton onClick={handleLogOut}>Log Out</StyledLogOutButton>
        </div>
      </StyledMainContainer>
    </StyledHeader>
  );
};
export default Header;
