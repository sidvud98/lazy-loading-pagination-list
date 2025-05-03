import { DATA_OBJECT } from "../constants/constants";

export const fetchPageData = (pageNumber, pageSize = 10) => {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Simulate a blocking delay of 1000ms
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(1000).then(() => {
    return {
      data: DATA_OBJECT.slice(startIndex, endIndex),
      totalLength: DATA_OBJECT.length,
    };
  });
};
