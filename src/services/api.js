export const fetchPageData = (
  pageNumber,
  pageSize = 5,
  fetchRemaining = false,
  filters = {},
  sortConfig = null,
  dataSource = [] // Accept the state as a parameter
) => {
  const startIndex = fetchRemaining ? pageSize : 0;
  const endIndex = startIndex + pageSize;

  // Simulate a blocking delay of 1000ms
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(1000).then(() => {
    let filteredData = dataSource; // Use the passed state as the data source

    // Apply filters
    if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
      const [start, end] = filters.dateRange;
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.details.date.split(".");
        const itemDate = new Date(year, month - 1, day);
        return itemDate >= start && itemDate <= end;
      });
    }
    if (filters.searchQuery) {
      filteredData = filteredData.filter(
        (item) =>
          item.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.about.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          item.about.status
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          item.details.date
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          item.details.invitedBy
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
      );
    }
    if (filters.statusFilter) {
      filteredData = filteredData.filter(
        (item) => item.about.status === filters.statusFilter
      );
    }

    // Apply sorting
    if (sortConfig?.key && sortConfig?.direction) {
      filteredData = [...filteredData].sort((a, b) => {
        let aValue, bValue;
        switch (sortConfig.key) {
          case "name":
            aValue = a.about.name;
            bValue = b.about.name;
            break;
          case "email":
            aValue = a.about.email;
            bValue = b.about.email;
            break;
          case "date":
            const [ad, am, ay] = a.details.date.split(".");
            const [bd, bm, by] = b.details.date.split(".");
            aValue = new Date(ay, am - 1, ad);
            bValue = new Date(by, bm - 1, bd);
            break;
          case "invitedBy":
            aValue = a.details.invitedBy;
            bValue = b.details.invitedBy;
            break;
          case "status":
            aValue = a.about.status;
            bValue = b.about.status;
            break;
          default:
            return 0;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return {
      data: filteredData.slice(
        (pageNumber - 1) * 10 + startIndex,
        (pageNumber - 1) * 10 + endIndex
      ),
      totalLength: filteredData.length,
    };
  });
};
