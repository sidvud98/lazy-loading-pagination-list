import {
  filterByDateRange,
  filterBySearchQuery,
  filterByStatus,
  sortData,
} from "../utils/helpers";

export const fetchPageData = (
  pageNumber,
  pageSize = 5,
  fetchRemaining = false,
  filters = {},
  sortConfig = null,
  dataSource = []
) => {
  const startIndex = fetchRemaining ? pageSize : 0;
  const endIndex = startIndex + fetchRemaining ? 2 * pageSize : pageSize;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(1000).then(() => {
    let filteredData = dataSource;

    if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
      filteredData = filterByDateRange(filteredData, filters.dateRange);
    }
    if (filters.searchQuery) {
      filteredData = filterBySearchQuery(filteredData, filters.searchQuery);
    }
    if (filters.statusFilter) {
      filteredData = filterByStatus(filteredData, filters.statusFilter);
    }

    if (sortConfig?.key && sortConfig?.direction) {
      filteredData = sortData(filteredData, sortConfig);
    }

    return {
      data: filteredData.slice(
        (pageNumber - 1) * (pageSize * 2) + startIndex,
        (pageNumber - 1) * (pageSize * 2) + endIndex
      ),
      totalLength: filteredData.length,
    };
  });
};
