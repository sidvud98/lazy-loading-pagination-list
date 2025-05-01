import { arr } from "./constant";
import React, { useState } from "react";
import styled from "styled-components";

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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PageButton = styled.button`
  margin: 0 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e0;
  background: ${({ active }) => (active ? "#edf2f7" : "black")};
  color: ${({ active }) => (!active ? "#edf2f7" : "black")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export default function RenderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(arr.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = arr.slice(startIndex, startIndex + pageSize);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <Container>
      <Title>User Invitations</Title>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Start Date</Th>
            <Th>Invited By</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentItems.map((item) => (
            <Tr key={item.id}>
              <Td>{item.about.name}</Td>
              <Td>{item.about.email}</Td>
              <Td>{item.details.date}</Td>
              <Td>{item.details.invitedBy}</Td>
              <Td>
                <Status status={item.about.status}>{item.about.status}</Status>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination>
        <PageButton
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          Prev
        </PageButton>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            active={currentPage === i + 1}
            onClick={() => changePage(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}
        <PageButton
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          Next
        </PageButton>
      </Pagination>
    </Container>
  );
}
