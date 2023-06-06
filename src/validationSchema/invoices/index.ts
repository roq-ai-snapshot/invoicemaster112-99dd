import * as yup from 'yup';
import { disputeValidationSchema } from 'validationSchema/disputes';
import { paymentValidationSchema } from 'validationSchema/payments';

export const invoiceValidationSchema = yup.object().shape({
  status: yup.string().required(),
  amount: yup.number().integer().required(),
  due_date: yup.date().required(),
  organisation_id: yup.string().nullable().required(),
  client_id: yup.string().nullable().required(),
  dispute: yup.array().of(disputeValidationSchema),
  payment: yup.array().of(paymentValidationSchema),
});
