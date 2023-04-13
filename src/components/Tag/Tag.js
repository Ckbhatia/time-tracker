import React, { useState } from "react";
import { NetworkStatus, useQuery } from "@apollo/client";
import Modal from "../Modal";
import { StyledMainTagContainer, StyledSelect } from "./Styled";
import { GetTags } from "../../service";
import { AuthContext } from "../../Context/AuthContext";
import { CREATE_NEW_TEXT, ERROR_MESSAGE, ERROR_TEXT } from "../../constants";
import { getTagValue } from "../../utils/tag";
import tost from "../../utils/toast";


const Tag = ({ updateTagId, currentTag, submitTaskTagData }) => {
  const [open, setOpen] = useState(false);
  const { userInfo } = React.useContext(AuthContext);
  
  const { loading, error, data, refetch, networkStatus } = useQuery(GetTags, {
    notifyOnNetworkStatusChange: true,
    variables: {
      author_id: userInfo?.userId,
    }
  }
  );

  const [selectedTag, setSelectedTag] = useState(() => getTagValue(data, currentTag));

  if(networkStatus === NetworkStatus.loading && data) {
    setSelectedTag(getTagValue(data, currentTag));
  }

  const handleChange = (e) => {
    const tagName = e?.target?.value;
    if (tagName !== CREATE_NEW_TEXT) {
      const tag = data?.time_tracker_tags?.find((tag) => tag.title === tagName)
      const tagId = tag?.id;
      if (submitTaskTagData) {
        submitTaskTagData(tagId);
        setSelectedTag(tagName);
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

  const autoSelectTag = (tagTitle, tagId) => {
    if(!selectedTag) {
      setSelectedTag("default");
    } 
    else if (tagTitle) {
      setSelectedTag(tagTitle);
      if (submitTaskTagData) {
      submitTaskTagData(tagId);
      }
    }
  }

  return (
    <StyledMainTagContainer>
        <div className="create-tag-container">
          <StyledSelect
            className="tag-select-menu"
            name="tag-menu"
            onChange={handleChange}
            value={selectedTag}
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
              data?.time_tracker_tags?.map((tag) => (
                <option key={tag.id} value={tag.title}>
                  {tag.title}
                </option>
              ))}
          </StyledSelect>
      </div>
      {open && <Modal open={open} setOpen={setOpen} refetch={refetch} autoSelectTag={autoSelectTag}/>}
    </StyledMainTagContainer>
  );
};

export default Tag;
