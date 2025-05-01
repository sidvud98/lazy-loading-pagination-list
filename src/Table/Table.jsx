import React, { useState, useMemo } from "react";
import { Pagination, Select, DatePicker, Input } from "antd";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { DATA_OBJECT } from "../constant";
import {
  Container,
  Title,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Status,
  StatusDropdown,
} from "./Table.style";

export default function RenderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [data, setData] = useState(DATA_OBJECT); // Store the imported array in local state
  const [dateRange, setDateRange] = useState([null, null]); // State for date range
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [statusFilter, setStatusFilter] = useState(null); // State for status filter
  const pageSize = 10;

  const totalUsers = data.length;

  const activeUsers = data.filter(
    (item) => item.about.status === "ACTIVE"
  ).length;

  const invitedUsers = data.filter(
    (item) => item.about.status === "INVITED"
  ).length;

  const blockedUsers = data.filter(
    (item) => item.about.status === "BLOCKED"
  ).length;

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split(".");
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10)
    );
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setDateRange([null, null]);
    setSearchQuery("");
    setStatusFilter(null);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    let result = data;
    if (dateRange?.[0] && dateRange?.[1]) {
      const [start, end] = dateRange;
      result = result.filter((item) => {
        const [day, month, year] = item.details.date.split(".");
        const itemDate = new Date(year, month - 1, day);
        return itemDate >= start && itemDate <= end;
      });
    }
    if (searchQuery) {
      result = result.filter((item) =>
        item.about.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter((item) => item.about.status === statusFilter);
    }
    return result;
  }, [data, dateRange, searchQuery, statusFilter]);

  const sortedArr = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
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
    return sorted;
  }, [sortConfig, filteredData]);

  const changeSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return { key: null, direction: null };
    });
    setCurrentPage(1);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort style={{ marginLeft: 4 }} />;
    if (sortConfig.direction === "asc")
      return <FaSortUp style={{ marginLeft: 4 }} />;
    if (sortConfig.direction === "desc")
      return <FaSortDown style={{ marginLeft: 4 }} />;
    return <FaSort style={{ marginLeft: 4 }} />;
  };

  const handleStatusChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, about: { ...item.about, status: newStatus } }
          : item
      )
    );
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = sortedArr.slice(startIndex, startIndex + pageSize);

  return (
    <Container>
      <Title>User Invitations</Title>
      <div className="sub-container">
        <div className="box">
          <strong>Total Users</strong>
          <div>{totalUsers}</div>
        </div>
        <div className="box">
          <strong>Active</strong>
          <div>{activeUsers}</div>
        </div>
        <div className="box">
          <strong>Invited</strong>
          <div>{invitedUsers}</div>
        </div>
        <div className="box">
          <strong>Blocked</strong>
          <div>{blockedUsers}</div>
        </div>
      </div>
      <div className="sub-container" style={{ display: "flex", gap: "1rem" }}>
        <Input
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ flex: 1 }}
        />
        <DatePicker.RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          style={{ flex: 1 }}
          allowClear
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "INVITED", label: "Invited" },
            { value: "BLOCKED", label: "Blocked" },
          ]}
        />
        <button onClick={handleClearFilters} className="clear-btn ">
          Clear
        </button>
      </div>
      <Table>
        <Thead>
          <Tr>
            <Th onClick={() => changeSort("name")}>
              Name{renderSortIcon("name")}
            </Th>
            <Th onClick={() => changeSort("email")}>
              Email{renderSortIcon("email")}
            </Th>
            <Th onClick={() => changeSort("date")}>
              Start Date{renderSortIcon("date")}
            </Th>
            <Th onClick={() => changeSort("invitedBy")}>
              Invited By{renderSortIcon("invitedBy")}
            </Th>
            <Th onClick={() => changeSort("status")}>
              Status{renderSortIcon("status")}
            </Th>
            <Th>Update Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentItems.map((item) => (
            <Tr key={item.id}>
              <Td>{item.about.name}</Td>
              <Td>{item.about.email}</Td>
              <Td>{formatDate(item.details.date)}</Td>
              <Td>{item.details.invitedBy}</Td>
              <Td>
                <Status status={item.about.status}>{item.about.status}</Status>
              </Td>
              <Td>
                <StatusDropdown
                  value={item.about.status}
                  onChange={(value) => handleStatusChange(item.id, value)}
                  options={[
                    { value: "ACTIVE", label: "Active" },
                    { value: "INVITED", label: "Invited" },
                    { value: "BLOCKED", label: "Blocked" },
                  ]}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div className="pagination">
        <Pagination
          current={currentPage}
          total={sortedArr.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </Container>
  );
}
