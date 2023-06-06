import * as yup from 'yup';
import { invoiceValidationSchema } from 'validationSchema/invoices';
import { reportValidationSchema } from 'validationSchema/reports';
import { userOrganisationValidationSchema } from 'validationSchema/user-organisations';

export const organisationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  invoice: yup.array().of(invoiceValidationSchema),
  report: yup.array().of(reportValidationSchema),
  user_organisation: yup.array().of(userOrganisationValidationSchema),
});
