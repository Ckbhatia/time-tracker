import React from "react";
import { useNavigate } from "react-router-dom";
import {
  StyledAvatarButton,
  StyledDropdown,
  StyledDropdownButton,
  StyledHeader,
  StyledLogoButton,
  StyledMainContainer,
  StyledMenuContainer,
} from "./Header.styles";
import { routes } from "../../constants/routes";
import { AuthContext } from "../../Context/AuthContext";
import { logOut } from "../../utils/auth";

const getDisplayName = (userInfo) => {
  if (!userInfo) return "User";

  return (
    userInfo.username ||
    userInfo.name ||
    (userInfo.email ? userInfo.email.split("@")[0] : "User")
  );
};

const getInitials = (userInfo) => {
  const displayName = getDisplayName(userInfo).trim();

  if (!displayName) return "U";

  const words = displayName.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
};

const Header = () => {
  const navigate = useNavigate();
  const menuRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const { setIsAuthenticated, userInfo } = React.useContext(AuthContext);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogOut = async () => {
    await logOut();
    await setIsAuthenticated(false);
    setIsOpen(false);
    navigate(routes.login);
  };

  const handleNavigateProfile = () => {
    setIsOpen(false);
    navigate(routes.profile);
  };

  return (
    <StyledHeader>
      <StyledMainContainer>
        <StyledLogoButton type="button" onClick={() => navigate(routes.tracker)}>
          TT
        </StyledLogoButton>

        <StyledMenuContainer ref={menuRef}>
          <StyledAvatarButton type="button" onClick={() => setIsOpen((prev) => !prev)}>
            {getInitials(userInfo)}
          </StyledAvatarButton>

          {isOpen ? (
            <StyledDropdown>
              <StyledDropdownButton type="button" onClick={handleNavigateProfile}>
                My profile
              </StyledDropdownButton>
              <StyledDropdownButton type="button" onClick={handleLogOut}>
                Log out
              </StyledDropdownButton>
            </StyledDropdown>
          ) : null}
        </StyledMenuContainer>
      </StyledMainContainer>
    </StyledHeader>
  );
};

export default Header;
