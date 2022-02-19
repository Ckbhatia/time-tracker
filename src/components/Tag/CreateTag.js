import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
// import { AiFillPlayCircle, AiTwotoneStop } from "react-icons/ai";
// import { GoPlus } from "react-icons/go";
import Modal from "../Modal";
import { StyledMainTagContainer, StyledSelect } from "./Styled";

// Add user id to fetch user specific tags only
const GetTags = gql`
  query {
    tags(order_by: { created_at: desc }) {
      id
      title
    }
  }
`;

const CreateTag = ({ updateTagId, currentTag, submitTaskTagData }) => {
  const [open, setOpen] = useState(false);
  const { loading, error, data } = useQuery(GetTags);

  const handleChange = (e) => {
    const tagName = e.target.value;
    if (tagName !== "__createNew") {
      const tag = data.tags.find((tag) => tag.title === tagName)
      const tagId = tag?.id;
      if (submitTaskTagData) {
        submitTaskTagData(tagId);
      } else {
        updateTagId(tagId);
      }
    }
  };

  if (error) return `Error! ${error.message}`;

  const getTagValue = (tagId) => {
    if(data && tagId) {
      const tag = data.tags.find((tag) => tag.id === tagId);
      return tag?.title;
    }
  }

  return (
    <StyledMainTagContainer>
        <div>{open && <Modal open={open} setOpen={setOpen} />}</div>
        <div className="create-tag-container">
          <StyledSelect
            className="tag-select-menu"
            name="tag-menu"
            onChange={handleChange}
            value={getTagValue(currentTag)}
          >
            <option
              className="create-tag"
              value={"__createNew"}
              onClick={() => setOpen(!open)}
            >
              + Tag
            </option>
            {!loading &&
              data.tags.map((tag) => (
                <option key={tag.id} value={tag.title}>
                  {tag.title}
                </option>
              ))}
          </StyledSelect>
      </div>
    </StyledMainTagContainer>
  );
};

export default CreateTag;
