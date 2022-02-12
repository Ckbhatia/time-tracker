import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { AiFillPlayCircle, AiTwotoneStop } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import Modal from "./Modal";

const GetTags = gql`
  query {
    tags(order_by: { created_at: desc }) {
      id
      name
    }
  }
`;

const CreateTag = ({ updateTagId, currentTag, submitTaskTagData }) => {
  const [open, setOpen] = useState(false);
  const { loading, error, data } = useQuery(GetTags);

  const handleChange = (e) => {
    const tagName = e.target.value;
    if (tagName !== "__createNew") {
      const tagId = data.tags.filter((tag) => tag.name === tagName)[0].id;
      if (submitTaskTagData) {
        submitTaskTagData(tagId);
      } else {
        updateTagId(tagId);
      }
    }
  };

  if (error) return `Error! ${error.message}`;

  return (
    <div className="main-create-tag">
        <div>{open && <Modal open={open} setOpen={setOpen} />}</div>
        <div className="create-tag-container">
          <select
            className="tag-select-menu"
            name="tag-menu"
            onChange={handleChange}
          >
            {currentTag && (
              <option className="default-tag" value={currentTag.name}>
                {currentTag && currentTag.name}
              </option>
            )}
            <option
              className="create-tag"
              value={"__createNew"}
              onClick={() => setOpen(!open)}
            >
              + Tag
            </option>
            {!loading &&
              data.tags.map((tag) => (
                <option key={tag.id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
          </select>
      </div>
    </div>
  );
};

export default CreateTag;
