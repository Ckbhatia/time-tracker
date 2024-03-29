
/**
 * Takes following arguments and returns a tag title
 * @param {object} data 
 * @param {number}} tagId 
 * @returns 
 */
export const getTagValue = (data, tagId) => {
  if(data && tagId) {
    const tag = data?.time_tracker_tags?.find((tag) => tag.id === tagId);
    return tag?.title;
  }
}