import React, { useState, useEffect, useRef, useMemo } from "react";
import { Pagination, Select, DatePicker, Input, Spin } from "antd";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import {
  DATA_OBJECT,
  TOTAL_NUMBER_OF_ROWS_IN_A_PAGE,
  BATCH_SIZE,
} from "../constants/constants";
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
  const [data, setData] = useState(originalData.slice(0, BATCH_SIZE)); // Store the imported array in local state
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const currentPageDataLengthRef = useRef(null);
  const lastRowRef = useRef(null);
  const prevLastRowRef = useRef(null);
  const additionalBatchNumber = useRef(0);
  const totalLengthRef = useRef(0);

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
    setData(originalData.slice(0, BATCH_SIZE));
    currentPageDataLengthRef.current = BATCH_SIZE;
    setSortConfig({ key: null, direction: null });
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
    fetchRemaining = false,
    batchNumber
  ) => {
    setLoading(true);
    if (!fetchRemaining) {
      setData([]);
      currentPageDataLengthRef.current = 0;
    }

    // Simulating a network delay
    const { data: initialRows, totalLength } = await fetchPageData(
      currentPage,
      BATCH_SIZE,
      fetchRemaining,
      { dateRange, searchQuery, statusFilter },
      sortConfig,
      originalData,
      batchNumber
    );

    setData((prevRows) => {
      currentPageDataLengthRef.current = fetchRemaining
        ? [...prevRows, ...initialRows].length
        : initialRows.length;
      return fetchRemaining ? [...prevRows, ...initialRows] : initialRows;
    });
    setTotalPages(Math.ceil(totalLength / TOTAL_NUMBER_OF_ROWS_IN_A_PAGE));
    totalLengthRef.current = totalLength;
    setLoading(false);
  };

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHasIntersected(true);
            } else {
              setHasIntersected(false);
            }
            const nonLastPageRemainingFlag =
              currentPage !== totalPages &&
              currentPageDataLengthRef.current <=
                TOTAL_NUMBER_OF_ROWS_IN_A_PAGE - BATCH_SIZE;

            const lastPageRemainingFlag =
              currentPage === totalPages &&
              currentPageDataLengthRef.current <=
                totalLengthRef % TOTAL_NUMBER_OF_ROWS_IN_A_PAGE;
            if (
              entry.isIntersecting &&
              (nonLastPageRemainingFlag || lastPageRemainingFlag)
            ) {
              additionalBatchNumber.current += 1;
              fetchData(
                currentPage,
                dateRange,
                searchQuery,
                statusFilter,
                sortConfig,
                originalData,
                true,
                additionalBatchNumber.current
              );
            }
          });
        },
        { threshold: 1.0 }
      ),
    [
      currentPage,
      dateRange,
      searchQuery,
      statusFilter,
      sortConfig,
      originalData,
    ]
  );

  useEffect(() => {
    // Clean up previous observer
    if (prevLastRowRef.current) {
      observer.unobserve(prevLastRowRef.current);
    }
    if (lastRowRef.current) {
      // Store current last row for cleanup in next update
      prevLastRowRef.current = lastRowRef.current;
      // Observe new last row
      observer.observe(lastRowRef.current);
    }

    return () => {
      if (prevLastRowRef.current) {
        observer.unobserve(prevLastRowRef.current);
      }
    };
  }, [data]);

  useEffect(() => {
    additionalBatchNumber.current = 0;
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

  return (
    <Container>
      <Title>User Invitations</Title>
      <div className="sub-container">
        <div
          className="box"
          onClick={() => {
            handleStatusFilterChange(null);
          }}
        >
          <strong>Total Users</strong>
          <div>{totalUsers}</div>
        </div>
        <div
          className="box"
          onClick={() => {
            handleStatusFilterChange("ACTIVE");
          }}
        >
          <strong>Active</strong>
          <div>{activeUsers}</div>
        </div>
        <div
          className="box"
          onClick={() => {
            handleStatusFilterChange("INVITED");
          }}
        >
          <strong>Invited</strong>
          <div>{invitedUsers}</div>
        </div>
        <div
          className="box"
          onClick={() => {
            handleStatusFilterChange("BLOCKED");
          }}
        >
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
            <Th>S. No</Th>
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
                ref={index === data.length - 1 ? lastRowRef : null}
              >
                <Td>
                  {index +
                    1 +
                    TOTAL_NUMBER_OF_ROWS_IN_A_PAGE * (currentPage - 1)}
                </Td>
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

          {loading ||
          (data.length === BATCH_SIZE && currentPage !== totalPages) ? (
            <Tr
              style={{
                verticalAlign: "center",
                height:
                  hasIntersected || data.length === BATCH_SIZE
                    ? "10px"
                    : "216px",
              }}
            >
              <Td colSpan="7" style={{ textAlign: "center" }}>
                <Spin size="medium" />
              </Td>
            </Tr>
          ) : null}
        </Tbody>
      </Table>
      <div className="pagination">
        <Pagination
          current={currentPage}
          total={totalPages * TOTAL_NUMBER_OF_ROWS_IN_A_PAGE}
          pageSize={TOTAL_NUMBER_OF_ROWS_IN_A_PAGE}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </Container>
  );
}
