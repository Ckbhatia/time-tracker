import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import Modal from "../Modal";
import { StyledMainTagContainer, StyledSelect } from "./Styled";
import { GetTags } from "../../service";
import { AuthContext } from "../../Context/AuthContext";
import { CREATE_NEW_TEXT, ERROR_MESSAGE, ERROR_TEXT } from "../../constants";
import tost from "../../utils/toast";

const CreateTag = ({ updateTagId, currentTag, submitTaskTagData }) => {
  const [open, setOpen] = useState(false);
  const { userInfo } = React.useContext(AuthContext);

  const { loading, error, data, refetch } = useQuery(GetTags, {
    variables: {
      author_id: userInfo?.userId,
    }
  }
);

  const handleChange = (e) => {
    const tagName = e?.target?.value;
    if (tagName !== CREATE_NEW_TEXT) {
      const tag = data?.tags?.find((tag) => tag.title === tagName)
      const tagId = tag?.id;
      if (submitTaskTagData) {
        submitTaskTagData(tagId);
      } else {
        updateTagId(tagId);
      }
    }
    else if(tagName === CREATE_NEW_TEXT) {
      setOpen(true);
    }
  };

  if (error) {
    tost(ERROR_TEXT, ERROR_MESSAGE);
  }

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
              value={CREATE_NEW_TEXT}
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
