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
import { getDisputeById, updateDisputeById } from 'apiSdk/disputes';
import { Error } from 'components/error';
import { disputeValidationSchema } from 'validationSchema/disputes';
import { DisputeInterface } from 'interfaces/dispute';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { InvoiceInterface } from 'interfaces/invoice';
import { UserInterface } from 'interfaces/user';
import { getInvoices } from 'apiSdk/invoices';
import { getUsers } from 'apiSdk/users';

function DisputeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DisputeInterface>(
    () => (id ? `/disputes/${id}` : null),
    () => getDisputeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DisputeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDisputeById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DisputeInterface>({
    initialValues: data,
    validationSchema: disputeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Dispute
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="resolution" mb="4" isInvalid={!!formik.errors?.resolution}>
              <FormLabel>Resolution</FormLabel>
              <Input type="text" name="resolution" value={formik.values?.resolution} onChange={formik.handleChange} />
              {formik.errors.resolution && <FormErrorMessage>{formik.errors?.resolution}</FormErrorMessage>}
            </FormControl>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<InvoiceInterface>
              formik={formik}
              name={'invoice_id'}
              label={'Select Invoice'}
              placeholder={'Select Invoice'}
              fetcher={getInvoices}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.organisation_id}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'legal_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
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
  entity: 'dispute',
  operation: AccessOperationEnum.UPDATE,
})(DisputeEditPage);
