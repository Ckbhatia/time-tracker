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

const CreateTag = ({ updateTag, currentTag }) => {
  const [open, setOpen] = useState(false);
  const { loading, error, data } = useQuery(GetTags);

  if (error) return `Error! ${error.message}`;

  return (
    <main className="main-create-tag">
      <div className="main-container">
        <div>{open && <Modal open={open} setOpen={setOpen} />}</div>
        <div className="create-tag-container">
          <select
            className="tag-select-menu"
            name="tag-menu"
            onChange={(e) => updateTag(e.target.value)}
          >
            {currentTag && (
              <option className="default-tag">
                {currentTag && currentTag.name}
              </option>
            )}
            <option className="create-tag" onClick={() => setOpen(!open)}>
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
    </main>
  );
};

export default CreateTag;
