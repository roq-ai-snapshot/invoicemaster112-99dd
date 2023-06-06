import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getOrganisationById } from 'apiSdk/organisations';
import { Error } from 'components/error';
import { OrganisationInterface } from 'interfaces/organisation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteInvoiceById } from 'apiSdk/invoices';
import { deleteReportById } from 'apiSdk/reports';
import { deleteUserOrganisationById } from 'apiSdk/user-organisations';

function OrganisationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OrganisationInterface>(
    () => (id ? `/organisations/${id}` : null),
    () =>
      getOrganisationById(id, {
        relations: ['user', 'invoice', 'report', 'user_organisation'],
      }),
  );

  const invoiceHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteInvoiceById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const reportHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteReportById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const user_organisationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteUserOrganisationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Organisation Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Name:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.name}
            </Text>
            <br />
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  User:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                    {data?.user?.email}
                  </Link>
                </Text>
              </>
            )}
            {hasAccess('invoice', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Invoices:
                </Text>
                <NextLink passHref href={`/invoices/create?organisation_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>status</Th>
                        <Th>amount</Th>
                        <Th>due_date</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.invoice?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.status}</Td>
                          <Td>{record.amount}</Td>
                          <Td>{record.due_date as unknown as string}</Td>
                          <Td>
                            <NextLink passHref href={`/invoices/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/invoices/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => invoiceHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('report', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  Reports:
                </Text>
                <NextLink passHref href={`/reports/create?organisation_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>report_type</Th>
                        <Th>start_date</Th>
                        <Th>end_date</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.report?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.report_type}</Td>
                          <Td>{record.start_date as unknown as string}</Td>
                          <Td>{record.end_date as unknown as string}</Td>
                          <Td>
                            <NextLink passHref href={`/reports/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/reports/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => reportHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('user_organisation', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold">
                  User Organisations:
                </Text>
                <NextLink passHref href={`/user-organisations/create?organisation_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4" as="a">
                    Create
                  </Button>
                </NextLink>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.user_organisation?.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            <NextLink passHref href={`/user-organisations/edit/${record.id}`}>
                              <Button as="a">Edit</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink passHref href={`/user-organisations/view/${record.id}`}>
                              <Button as="a">View</Button>
                            </NextLink>
                          </Td>
                          <Td>
                            <Button onClick={() => user_organisationHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'organisation',
  operation: AccessOperationEnum.READ,
})(OrganisationViewPage);
