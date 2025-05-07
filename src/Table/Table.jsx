import React, { useState, useEffect, useRef, useMemo } from "react";
import { Pagination, Select, DatePicker, Input, Spin } from "antd";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { DATA_OBJECT } from "../constants/constants";
import { fetchPageData } from "../services/api";
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
import { formatDate } from "../utils/helpers";

export default function RenderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [originalData, setOriginalData] = useState(DATA_OBJECT); // State to hold the original data
  const [data, setData] = useState(originalData.slice(0, 5)); // Store the imported array in local state
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const fifthRowRef = useRef(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  const totalUsers = originalData.length;

  const activeUsers = originalData.filter(
    (item) => item.about.status === "ACTIVE"
  ).length;

  const invitedUsers = originalData.filter(
    (item) => item.about.status === "INVITED"
  ).length;

  const blockedUsers = originalData.filter(
    (item) => item.about.status === "BLOCKED"
  ).length;

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
    setData(originalData.slice(0, 5));
    setCurrentPage(1);
  };

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
    setOriginalData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, about: { ...item.about, status: newStatus } }
          : item
      )
    );
  };

  const fetchData = async (
    currentPage,
    dateRange,
    searchQuery,
    statusFilter,
    sortConfig,
    originalData,
    fetchRemaining = false
  ) => {
    setLoading(true);
    if (!fetchRemaining) setData([]);

    // Simulating a network delay
    const { data: initialRows, totalLength } = await fetchPageData(
      currentPage,
      5,
      fetchRemaining,
      { dateRange, searchQuery, statusFilter },
      sortConfig,
      originalData
    );

    setData((prevRows) =>
      fetchRemaining ? [...prevRows, ...initialRows] : initialRows
    );
    setTotalPages(Math.ceil(totalLength / 10));
    setLoading(false);
  };

  useEffect(() => {
    fetchData(
      currentPage,
      dateRange,
      searchQuery,
      statusFilter,
      sortConfig,
      originalData
    );
  }, [
    currentPage,
    dateRange,
    searchQuery,
    statusFilter,
    sortConfig,
    originalData,
  ]);

  const memoizedDataArray = useMemo(() => data, [data.join(",")]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasIntersected(true);
          } else {
            setHasIntersected(false);
          }
          if (entry.isIntersecting && data.length <= 5) {
            fetchData(
              currentPage,
              dateRange,
              searchQuery,
              statusFilter,
              sortConfig,
              originalData,
              true
            );
          }
        });
      },
      { threshold: 1.0 }
    );

    if (fifthRowRef.current) {
      observer.observe(fifthRowRef.current);
    }

    return () => {
      if (fifthRowRef.current) {
        observer.unobserve(fifthRowRef.current);
      }
    };
  }, [memoizedDataArray]);

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
          {data &&
            data.map((item, index) => (
              <Tr
                key={item.id}
                ref={index === data.length - 1 ? fifthRowRef : null}
              >
                <Td>{item.about.name}</Td>
                <Td>{item.about.email}</Td>
                <Td>{formatDate(item.details.date)}</Td>
                <Td>{item.details.invitedBy}</Td>
                <Td>
                  <Status status={item.about.status}>
                    {item.about.status}
                  </Status>
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

          {loading || (data.length === 5 && currentPage !== totalPages) ? (
            <Tr
              style={{
                verticalAlign: "center",
                height: hasIntersected || data.length === 5 ? "10px" : "216px",
              }}
            >
              <Td colSpan="6" style={{ textAlign: "center" }}>
                <Spin size="medium" />
              </Td>
            </Tr>
          ) : null}
        </Tbody>
      </Table>
      <div className="pagination">
        <Pagination
          current={currentPage}
          total={totalPages * pageSize}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </Container>
  );
}
