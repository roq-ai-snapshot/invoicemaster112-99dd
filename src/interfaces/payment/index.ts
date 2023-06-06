import { InvoiceInterface } from 'interfaces/invoice';
import { UserInterface } from 'interfaces/user';

export interface PaymentInterface {
  id?: string;
  invoice_id: string;
  payer_id: string;
  amount: number;
  payment_date: Date;

  invoice?: InvoiceInterface;
  user?: UserInterface;
  _count?: {};
}
