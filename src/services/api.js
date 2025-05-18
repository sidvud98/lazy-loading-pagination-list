import {
  filterByDateRange,
  filterBySearchQuery,
  filterByStatus,
  sortData,
} from "../utils/helpers";
import {
  SIMULATED_NETWORK_DELAY,
  TOTAL_NUMBER_OF_ROWS_IN_A_PAGE,
} from "../constants/constants";

export const fetchPageData = (
  pageNumber = 1,
  batchSize = 5,
  fetchRemaining = false,
  filters = {},
  sortConfig = null,
  dataSource = [],
  batchNumber = 1
) => {
  const startIndex = fetchRemaining ? batchNumber * batchSize : 0;
  const endIndex =
    startIndex + fetchRemaining ? (batchNumber + 1) * batchSize : batchSize;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(SIMULATED_NETWORK_DELAY).then(() => {
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

    const responseData = filteredData.slice(
      (pageNumber - 1) * TOTAL_NUMBER_OF_ROWS_IN_A_PAGE + startIndex,
      (pageNumber - 1) * TOTAL_NUMBER_OF_ROWS_IN_A_PAGE + endIndex
    );
    return {
      data: responseData,
      totalLength: filteredData.length,
    };
  });
};
