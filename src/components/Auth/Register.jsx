import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import { register } from "../../service";
import {
  StyledButtonContainer,
  StyledContainer,
  StyledExtraActionContainer,
  StyledFormContainer,
  StyledInput,
  StyledInputContainer,
  StyledLinkContainer,
  StyledSection,
  StyledSubmit,
} from "./Styles";
import { routes } from "../../constants/routes";
import { saveInfo } from "../../utils/storage";
import { USER_INFO_TEXT } from "../../constants";
import { handleAuthError } from "../../utils/auth";

const Register = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [registerUser, { data, loading, error, reset }] = useMutation(register);

  if (error) {
    handleAuthError(error);
    reset()
  }

  React.useEffect(() => {
    if (data) {
      const token = data?.signup?.token;
      const userId = data?.signup?.id;
      if(token) {
        saveInfo(USER_INFO_TEXT, {token, userId});
        navigate(routes.tracker)
      }
    }
  }, [data, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to the server
    registerUser({
      variables: {
        name,
        username,
        email,
        password,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { name, username, email, password } = formData;

  const isEmpty = !name || !username || !email || !password;

  return (
    <StyledSection>
      <StyledContainer>
        <StyledFormContainer onSubmit={handleSubmit}>
          <StyledInputContainer>
            <StyledInput
              name="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleChange}
              required
            />
          </StyledInputContainer>
          <StyledInputContainer>
            <StyledInput
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              required
            />
          </StyledInputContainer>
          <StyledInputContainer>
            <StyledInput
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
          </StyledInputContainer>
          <StyledInputContainer>
            <StyledInput
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
          </StyledInputContainer>
          <StyledInputContainer>
            {!loading ?
              <StyledSubmit disabled={isEmpty} type="submit" value="Register" />
            :
            <StyledButtonContainer>
              <CircularProgress />
            </StyledButtonContainer>
            }
          </StyledInputContainer>
        </StyledFormContainer>
        <StyledExtraActionContainer>
          <StyledLinkContainer>
            Already a member?
            <Link to="/login">Sign in</Link>
          </StyledLinkContainer>
        </StyledExtraActionContainer>
      </StyledContainer>
    </StyledSection>
  );
};

export default Register;
