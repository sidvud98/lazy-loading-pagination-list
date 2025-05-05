export const formatDate = (dateStr) => {
  const [day, month, year] = dateStr.split(".");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const filterByDateRange = (data, dateRange) => {
  const [start, end] = dateRange;
  return data.filter((item) => {
    const [day, month, year] = item.details.date.split(".");
    const itemDate = new Date(year, month - 1, day);
    return itemDate >= start && itemDate <= end;
  });
};

export const filterBySearchQuery = (data, searchQuery) => {
  return data.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.about.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.about.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.invitedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const filterByStatus = (data, statusFilter) => {
  return data.filter((item) => item.about.status === statusFilter);
};

export const sortData = (data, sortConfig) => {
  return [...data].sort((a, b) => {
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
};
