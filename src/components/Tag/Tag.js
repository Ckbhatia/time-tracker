import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { MdDelete } from "react-icons/md";
import Modal from "../Modal";
import TagModal from "../TagModal";
import { StyledMainTagContainer } from "./Styled";
import { deleteOneTaskTag, GetTags } from "../../service";
import { AuthContext } from "../../Context/AuthContext";
import {
  ERROR_MESSAGE,
  ERROR_TEXT,
  INFO_TEXT,
  SUCCESS_TEXT,
} from "../../constants";
import { getTagValue } from "../../utils/tag";
import tost from "../../utils/toast";

const Tag = ({ updateTagId, currentTag, submitTaskTagData }) => {
  const [open, setOpen] = useState(false);
  const [isTagSelectOpen, setTagSelectOpen] = useState(false);

  const { userInfo } = React.useContext(AuthContext);
  const userId = userInfo?.userId;

  const { loading, error, data, refetch } = useQuery(GetTags, {
    skip: !userId,
    variables: {
      author_id: userId,
    },
  });

  const [selectedTag, setSelectedTag] = useState(() =>
    getTagValue(data, currentTag)
  );

  useEffect(() => {
    if (!data) {
      if (!currentTag) {
        setSelectedTag("");
      }
      return;
    }

    setSelectedTag(getTagValue(data, currentTag) || "");
  }, [currentTag, data]);

  const [
    deleteATaskTag,
    {
      data: tagData,
      loading: loadingTag,
      reset: resetDeleteOneTag,
    },
  ] = useMutation(deleteOneTaskTag, {
    onCompleted: () => {
      refetch();
      tost(SUCCESS_TEXT, "Deleted a tag successfully");
      resetDeleteOneTag();
    },
    onError: () => {
      tost(ERROR_TEXT, "Tag deletion failed");
      resetDeleteOneTag();
    },
  });

  const handleTagSelect = (e) => {
    const currentTagId = e?.target?.value;
    if (currentTagId) {
      const tag = data?.time_tracker_tags?.find(
        (tag) => tag.id === currentTagId
      );
      const tagId = tag?.id;
      setSelectedTag(tag.title);
      if (submitTaskTagData) {
        submitTaskTagData(tagId);
      } else {
        updateTagId(tagId);
      }
      setTagSelectOpen(false);
    }
  };

  if (error) {
    tost(ERROR_TEXT, ERROR_MESSAGE);
  }

  const autoSelectTag = (tagTitle, tagId) => {
    if (!selectedTag) {
      setSelectedTag("default");
    } else if (tagTitle) {
      setSelectedTag(tagTitle);
      if (submitTaskTagData) {
        submitTaskTagData(tagId);
      }
    }
  };

  const handleTagOpen = () => {
    setTagSelectOpen(true);
  };

  const handleTagClose = () => {
    setTagSelectOpen(false);
  };

  const handleCreateTagOpen = () => {
    setOpen(true);
  };

  if (!tagData && loadingTag) {
    tost(INFO_TEXT, "Deleting a tag...");
    resetDeleteOneTag();
  }

  return (
    <StyledMainTagContainer>
      <div className="create-tag-container">
        <span className="tag-select-text" onClick={handleTagOpen}>
          {selectedTag || "Select a tag"}
        </span>
      </div>
      {isTagSelectOpen && (
        <Modal open={isTagSelectOpen} handleClose={handleTagClose}>
          <div className="tag-select-menu" name="tag-menu">
            <div className="custom-dropdown">
              <button className="create-tag" onClick={handleCreateTagOpen}>
                Create a new
              </button>
              <div className="selected-item">Select an option</div>
              <ul className="options-list" onClick={handleTagSelect}>
                {!loading &&
                  data?.time_tracker_tags?.map((tag) => (
                    <li key={tag?.id} value={tag?.id}>
                      {tag.title}
                      <button
                        onClick={() => {
                          deleteATaskTag({
                            variables: {
                              tag_id: tag?.id,
                            },
                          });
                        }}
                        disabled={loadingTag}
                      >
                        <MdDelete />
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
      {open && (
        <TagModal
          open={open}
          setOpen={setOpen}
          refetch={refetch}
          autoSelectTag={autoSelectTag}
        />
      )}
    </StyledMainTagContainer>
  );
};

export default Tag;
