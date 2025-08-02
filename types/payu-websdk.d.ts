declare module 'payu-websdk' {
  interface PayUConfig {
    key: string;
    salt: string;
    txnid: string;
    amount: number;
    productinfo: string;
    firstname: string;
    email: string;
    phone?: string;
    surl?: string;
    furl?: string;
    curl?: string;
    hash?: string;
    mode?: string;
  }

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
    hash: string;
  }

  interface PayUResponse {
    status: string;
    message: string;
    txnid?: string;
    error_code?: string;
  }

  interface PayUVerifyResponse {
    transaction_details: {
      [txnid: string]: {
        status: string;
        message: string;
        txnid: string;
        amount: number;
        productinfo: string;
        firstname: string;
        email: string;
        phone: string;
        hash: string;
        bank_ref_num?: string;
        bankcode?: string;
        error_code?: string;
        error_Message?: string;
      };
    };
  }

  class PayU {
    constructor();
    paymentInitiate(data: PayUTransactionData): Promise<PayUResponse>;
    verifyPayment(txnid: string): Promise<PayUVerifyResponse>;
  }

  export default PayU;
} 