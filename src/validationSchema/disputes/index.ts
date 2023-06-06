import * as yup from 'yup';

export const disputeValidationSchema = yup.object().shape({
  description: yup.string().required(),
  resolution: yup.string(),
  status: yup.string().required(),
  invoice_id: yup.string().nullable().required(),
  legal_id: yup.string().nullable().required(),
});
