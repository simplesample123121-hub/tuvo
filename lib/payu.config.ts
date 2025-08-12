import PayU from 'payu-websdk'
import crypto from 'crypto'

// PayU Configuration
// Prefer server-only env vars if available; fall back to public test creds for dev
const PAYU_KEY =
  process.env.PAYU_MERCHANT_KEY ||
  process.env.PAYU_KEY ||
  process.env.NEXT_PUBLIC_PAYU_KEY ||
  'gtKFFx'
const PAYU_SALT =
  process.env.PAYU_MERCHANT_SALT ||
  process.env.PAYU_SALT ||
  process.env.NEXT_PUBLIC_PAYU_SALT ||
  '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW'

// Create PayU client
const resolvedEnvRaw =
  process.env.PAYU_MODE || process.env.NEXT_PUBLIC_PAYU_MODE || 'TEST'
const resolvedEnv = String(resolvedEnvRaw).toUpperCase() === 'PROD' ? 'PROD' : 'TEST'

const payuClient = new PayU(
  {
    key: PAYU_KEY,
    salt: PAYU_SALT,
  },
  resolvedEnv
)

export const PAYU_CONFIG = {
  key: PAYU_KEY,
  salt: PAYU_SALT,
  mode: resolvedEnv,
  baseURL:
    process.env.NEXT_PUBLIC_PAYU_BASE_URL ||
    (resolvedEnv === 'PROD' ? 'https://secure.payu.in' : 'https://test.payu.in'),
  successURL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
  failureURL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure`,
  cancelURL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure`
}

// Generate a unique transaction ID
export const generateTransactionId = () => {
  // PayU supports up to 25 chars for txnid; ensure high entropy and valid charset
  const timestamp = Date.now().toString().slice(-10)
  const randomPart = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')
  const txn = `TXN${timestamp}${randomPart}`
  return txn.slice(0, 25)
}

// Create PayU transaction
export const createPayUTransaction = async ({
  email,
  firstname,
  mobile,
  txnid = generateTransactionId(),
  amount,
  productinfo,
  udf1 = '',
  udf2 = '',
  udf3 = '',
  udf4 = '',
  udf5 = '',
}: {
  email: string
  firstname: string
  mobile: string
  txnid?: string
  amount: number
  productinfo: string
  udf1?: string
  udf2?: string
  udf3?: string
  udf4?: string
  udf5?: string
}) => {
  try {
    // Format amount as string with 2 decimals (PayU expects stringified amount)
    const amountStr = Number(amount).toFixed(2)

    // Prepare the string to hash (sequence as per PayU docs)
    const hashString = `${PAYU_KEY}|${txnid}|${amountStr}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`

    // Calculate the hash using PayU's expected format
    const hashV1 = crypto.createHash('sha512').update(hashString).digest('hex')
    const hashV2 = crypto.createHash('sha512').update(hashString).digest('hex')
    const hash = {
      v1: hashV1,
      v2: hashV2
    }

    // Use PayU WebSDK to initiate payment
    const data = await payuClient.paymentInitiate({
      isAmountFilledByCustomer: false,
      txnid: txnid,
      amount: Number(amountStr),
      currency: 'INR',
      productinfo: productinfo,
      firstname: firstname,
      email: email,
      phone: mobile,
      surl: `${PAYU_CONFIG.successURL}/${txnid}`,
      furl: `${PAYU_CONFIG.failureURL}/${txnid}`,
      hash: hash
    })

    return data

  } catch (error) {
    console.error('Error creating PayU transaction:', error)
    throw error
  }
}

// Verify PayU payment
export const verifyPayUPayment = async (txnid: string) => {
  try {
    const verifiedData = await payuClient.verifyPayment(txnid)
    const data = verifiedData?.transaction_details?.[txnid]

    return {
      status: data?.status || 'failed',
      txnid: data?.txnid || txnid,
      amount: data?.amt || '0',
      productinfo: data?.productinfo || '',
      firstname: data?.firstname || '',
      email: data?.email || '',
      mihpayid: data?.mihpayid || '',
      status_message: data?.error_Message || data?.status || 'Unknown status',
      bank_ref_num: data?.bank_ref_num || '',
      mode: data?.mode || '',
      error_code: data?.error_code || '',
      error_message: data?.error_Message || '',
      created_at: data?.addedon ? new Date(data.addedon).toLocaleString() : ''
    }
  } catch (error) {
    console.error('Error verifying PayU payment:', error)
    throw error
  }
}