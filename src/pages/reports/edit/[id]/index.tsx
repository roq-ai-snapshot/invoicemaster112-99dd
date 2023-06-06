import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getReportById, updateReportById } from 'apiSdk/reports';
import { Error } from 'components/error';
import { reportValidationSchema } from 'validationSchema/reports';
import { ReportInterface } from 'interfaces/report';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { OrganisationInterface } from 'interfaces/organisation';
import { getUsers } from 'apiSdk/users';
import { getOrganisations } from 'apiSdk/organisations';

function ReportEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ReportInterface>(
    () => (id ? `/reports/${id}` : null),
    () => getReportById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ReportInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateReportById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ReportInterface>({
    initialValues: data,
    validationSchema: reportValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Report
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="report_type" mb="4" isInvalid={!!formik.errors?.report_type}>
              <FormLabel>Report Type</FormLabel>
              <Input type="text" name="report_type" value={formik.values?.report_type} onChange={formik.handleChange} />
              {formik.errors.report_type && <FormErrorMessage>{formik.errors?.report_type}</FormErrorMessage>}
            </FormControl>
            <FormControl id="start_date" mb="4">
              <FormLabel>Start Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.start_date}
                onChange={(value: Date) => formik.setFieldValue('start_date', value)}
              />
            </FormControl>
            <FormControl id="end_date" mb="4">
              <FormLabel>End Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.end_date}
                onChange={(value: Date) => formik.setFieldValue('end_date', value)}
              />
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'finance_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<OrganisationInterface>
              formik={formik}
              name={'organisation_id'}
              label={'Select Organisation'}
              placeholder={'Select Organisation'}
              fetcher={getOrganisations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'report',
  operation: AccessOperationEnum.UPDATE,
})(ReportEditPage);
