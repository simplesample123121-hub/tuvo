declare module 'payu-websdk' {
  interface PayUTransactionData {
    isAmountFilledByCustomer: boolean;
    txnid: string;
    amount: number;
    currency: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: { v1: string; v2: string } | string;
  }

  interface PayUResponse {
    status: string;
    message?: string;
    txnid?: string;
    error_code?: string;
    [key: string]: any;
  }

  interface PayUVerifyTransactionDetails {
    status: string;
    message?: string;
    txnid: string;
    amt?: string | number; // PayU often returns 'amt'
    amount?: string | number; // Some variants return 'amount'
    productinfo?: string;
    firstname?: string;
    email?: string;
    phone?: string;
    hash?: string;
    mihpayid?: string;
    bank_ref_num?: string;
    bankcode?: string;
    mode?: string;
    error_code?: string;
    error_Message?: string;
    addedon?: string;
  }

  interface PayUVerifyResponse {
    transaction_details: {
      [txnid: string]: PayUVerifyTransactionDetails;
    };
  }

  class PayU {
    constructor(config: { key: string; salt: string }, environment?: string);
    paymentInitiate(data: PayUTransactionData): Promise<PayUResponse>;
    verifyPayment(txnid: string): Promise<PayUVerifyResponse>;
  }

  export default PayU;
}