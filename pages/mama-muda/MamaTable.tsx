import React from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Textarea,
  Badge,
} from "@chakra-ui/react";
import { formatDate, MessageProps } from '.';

type MamaTableProps = {
  data: MessageProps[]
}

const StatusBadge = ({status}: {status: string | undefined}) => {
  let color = "yellow";
  let statusText = "waiting"

  if(status === "failed") {
    color = "red"
    statusText = "failed"
  } else  if (status === "success") {
    color = "green"
    statusText = "success"
  }

  return <Badge colorScheme={color}>{statusText}</Badge>;
}

export default function MamaTable({data}: MamaTableProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Phone Number</Th>
          <Th>Message</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {
          data?.map((message: MessageProps, index: number) => (
            <Tr key={index}>
              <Td>{formatDate(message.createdAt)}</Td>
              <Td>{message.phoneNumber}</Td>
              <Td>
                {message.message}
              </Td>
              <Td>
                <StatusBadge status={message.status} />
              </Td>
            </Tr>  
        ))}
      </Tbody>
    </Table>
  )

}