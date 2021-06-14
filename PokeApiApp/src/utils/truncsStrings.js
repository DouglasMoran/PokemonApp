export const getId = strUrl => {
  return strUrl.slice(strUrl.length - 2, strUrl.length - 1);
};


export const truncateStr = (str, numberOfChar) => {
  if (str.length <= numberOfChar) {
    return str;
  }
  return str.slice(0, numberOfChar) + '...';
};
