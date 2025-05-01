import styled from "styled-components";
import { Select } from "antd";

export const Container = styled.div`
  padding: 1rem;
  overflow-x: auto;

  .sub-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    .box {
      flex: 1;
      padding: 1rem;
      background: #f7fafc;
      text-align: center;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      color: black;
    }
  }

  .pagination {
    margin-top: 1rem;
    text-align: center;
  }
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: #f7fafc;
`;

export const Th = styled.th`
  padding: 0.5rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  &:not(:first-child) {
    border-top: 1px solid #e2e8f0;
  }
`;

export const Td = styled.td`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #2d3748;
`;

export const Status = styled.span`
  font-weight: 600;
  color: ${({ status }) =>
    status === "BLOCKED"
      ? "#e53e3e"
      : status === "INVITED"
      ? "#d69e2e"
      : "#38a169"};
`;

export const StatusDropdown = styled(Select)`
  width: 100%;
`;
