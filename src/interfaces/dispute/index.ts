import { InvoiceInterface } from 'interfaces/invoice';
import { UserInterface } from 'interfaces/user';

export interface DisputeInterface {
  id?: string;
  invoice_id: string;
  legal_id: string;
  description: string;
  resolution?: string;
  status: string;

  invoice?: InvoiceInterface;
  user?: UserInterface;
  _count?: {};
}
