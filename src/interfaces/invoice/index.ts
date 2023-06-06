import { DisputeInterface } from 'interfaces/dispute';
import { PaymentInterface } from 'interfaces/payment';
import { OrganisationInterface } from 'interfaces/organisation';
import { UserInterface } from 'interfaces/user';

export interface InvoiceInterface {
  id?: string;
  organisation_id: string;
  client_id: string;
  status: string;
  amount: number;
  due_date: Date;
  dispute?: DisputeInterface[];
  payment?: PaymentInterface[];
  organisation?: OrganisationInterface;
  user?: UserInterface;
  _count?: {
    dispute?: number;
    payment?: number;
  };
}
