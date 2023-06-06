import { UserInterface } from 'interfaces/user';
import { OrganisationInterface } from 'interfaces/organisation';

export interface ReportInterface {
  id?: string;
  finance_id: string;
  organisation_id: string;
  report_type: string;
  start_date: Date;
  end_date: Date;

  user?: UserInterface;
  organisation?: OrganisationInterface;
  _count?: {};
}
