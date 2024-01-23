export const loadLocalSavedData = (mediaUrl, fileName) => {
  let mediaUrlName = mediaUrl;
  if (mediaUrl.includes('blob')) {
    mediaUrlName = fileName;
  }
  const data = JSON.parse(localStorage.getItem(`draftJs-${ mediaUrlName }`));
  return data;
};

export const isPresentInLocalStorage = (mediaUrl, fileName) => {
  if (mediaUrl !== null) {
    let mediaUrlName = mediaUrl;
    if (mediaUrl.includes('blob')) {
      mediaUrlName = fileName;
    }

    const data = localStorage.getItem(`draftJs-${ mediaUrlName }`);
    if (data !== null) {
      return true;
    }

    return false;
  }

  return false;
};
