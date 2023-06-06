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
import { getPaymentById, updatePaymentById } from 'apiSdk/payments';
import { Error } from 'components/error';
import { paymentValidationSchema } from 'validationSchema/payments';
import { PaymentInterface } from 'interfaces/payment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { InvoiceInterface } from 'interfaces/invoice';
import { UserInterface } from 'interfaces/user';
import { getInvoices } from 'apiSdk/invoices';
import { getUsers } from 'apiSdk/users';

function PaymentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PaymentInterface>(
    () => (id ? `/payments/${id}` : null),
    () => getPaymentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PaymentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePaymentById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PaymentInterface>({
    initialValues: data,
    validationSchema: paymentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Payment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                name="amount"
                value={formik.values?.amount}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
            </FormControl>
            <FormControl id="payment_date" mb="4">
              <FormLabel>Payment Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.payment_date}
                onChange={(value: Date) => formik.setFieldValue('payment_date', value)}
              />
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
              name={'payer_id'}
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
  entity: 'payment',
  operation: AccessOperationEnum.UPDATE,
})(PaymentEditPage);
