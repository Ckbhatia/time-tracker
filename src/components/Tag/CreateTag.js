import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Modal from "../Modal";
import { StyledMainTagContainer, StyledSelect } from "./Styled";

// TODO: Add user id to fetch user specific tags only
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
  const { loading, error, data, refetch } = useQuery(GetTags);

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
    else if(tagName === "__createNew") {
      setOpen(true);
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
        <div className="create-tag-container">
          <StyledSelect
            className="tag-select-menu"
            name="tag-menu"
            onChange={handleChange}
            value={getTagValue(currentTag)}
            defaultValue="default"
          >
             <option
              disabled
              value="default"
            >
              Select tag
            </option>
            <option
              className="create-tag"
              value={"__createNew"}
            >
              Create +
            </option>
            {!loading &&
              data.tags.map((tag) => (
                <option key={tag.id} value={tag.title}>
                  {tag.title}
                </option>
              ))}
          </StyledSelect>
      </div>
      {open && <Modal open={open} setOpen={setOpen} refetch={refetch} />}
    </StyledMainTagContainer>
  );
};

export default CreateTag;
