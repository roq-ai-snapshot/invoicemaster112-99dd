import * as yup from 'yup';

export const reportValidationSchema = yup.object().shape({
  report_type: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  finance_id: yup.string().nullable().required(),
  organisation_id: yup.string().nullable().required(),
});
