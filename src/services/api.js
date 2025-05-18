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
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(SIMULATED_NETWORK_DELAY).then(() => {
    let filteredData = dataSource;

    // Apply filters first
    if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
      filteredData = filterByDateRange(filteredData, filters.dateRange);
    }
    if (filters.searchQuery) {
      filteredData = filterBySearchQuery(filteredData, filters.searchQuery);
    }
    if (filters.statusFilter) {
      filteredData = filterByStatus(filteredData, filters.statusFilter);
    }

    // Apply sorting
    if (sortConfig?.key && sortConfig?.direction) {
      filteredData = sortData(filteredData, sortConfig);
    }

    // Calculate pagination indexes
    const pageStartIndex = (pageNumber - 1) * TOTAL_NUMBER_OF_ROWS_IN_A_PAGE;
    const batchStartIndex = fetchRemaining ? (batchNumber - 1) * batchSize : 0;
    const startIndex = pageStartIndex + batchStartIndex;
    const endIndex = startIndex + batchSize;

    // Get the data for current batch
    const responseData = filteredData.slice(startIndex, endIndex);

    return {
      data: responseData,
      totalLength: filteredData.length,
    };
  });
};
