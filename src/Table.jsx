import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { Pagination } from "antd";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { arr } from "./constant";

const Container = styled.div`
  padding: 1rem;
  overflow-x: auto;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f7fafc;
`;

const Th = styled.th`
  padding: 0.5rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  /* display as default table-cell to maintain column layout */
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:not(:first-child) {
    border-top: 1px solid #e2e8f0;
  }
`;

const Td = styled.td`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #2d3748;
`;

const Status = styled.span`
  font-weight: 600;
  color: ${({ status }) =>
    status === "BLOCKED"
      ? "#e53e3e"
      : status === "INVITED"
        ? "#d69e2e"
        : "#38a169"};
`;

export default function RenderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const pageSize = 10;

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split(".");
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sortedArr = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return arr;
    const sorted = [...arr].sort((a, b) => {
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
  }, [sortConfig]);

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

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = sortedArr.slice(startIndex, startIndex + pageSize);

  return (
    <Container>
      <Title>User Invitations</Title>
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
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
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
