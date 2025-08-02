import PayU from 'payu-websdk'
import crypto from 'crypto'

// PayU Configuration (matching the working implementation exactly)
const PAYU_CONFIG = {
  key: 'YtZVuv',
  salt: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDOs/fD5n8GLaXcaDgj53z0JdFe0sclSXemO3fu7+gJAei5r6oTk0EOnVW7Sh61YYV1J7nzaM5g16ZLVIfGH29LDjN6egOnpgCJ7J8qXv4zyHi88tE1k9soKynw7Ff2r/J6EbyFNWR6bWULF9qNu31PxCNjuuTbhmmiE1u1eF/hRlf5NwMn3GPyI8lfUSD/wMAMY8iJuc9Ihj4MD3689zJywMT4MWScjvlIQrJRFFlzTGzyLc1egnhuAqLNebtxpmxowSBCjDw0YRgZTa1PrbbsEAGh6PGb6u3DS82ICCSUhgukOCX+fv3CT8NJ/iccaviAfFqCMUwNIh/h21pBmJm/AgMBAAECggEAZVjeIYIxQ9E74o6DAC+vF3I3btu/4utbq/i6fD/KsCfseKbFqCVqH4VLFLJpzhsLuX6J8OuxTNBPa939WEnvYoiK+wE6K4f7+aQ4AiljT/Z6JIKVy0Q8jzxiqwrmskBgjjOGEHY2VsSuZzsB4L5N2b9cbrijH3OO9XWyYI6tzCC0yU1vV+K9lYZ5ecRGkG50wcgjqOOTUINz1aynbe2rN4Nb+of+aWBZ4jOR1IoSy0XUz0c6SUFsldYxbMOAq9EvqL8gQhgy6D2I+Pdjc2g8eHxdoudFBxQoXhd1YjRW1AvteL43kPvTakvwz8HqwrtJYJX4vDspjk+cRRtMRE+zMQKBgQDoQ4njSoxcdM9vTvgS5/55Z97EinGFtEeBJYkShHqU477v+jGS4155ulEpzRHnG1oZ4ABuFZWqN8qYDFl43T0Vy9vk4FPtNHsz7CO5Vsp4eW8uIMqR6QDJc2ioRN4Rox43/DiVPU6ujxhbbUfCoeIGOrMcg9Ys+gy0076DNxUQaQKBgQDj07Ws/tANq3USYkPwrm+8zDQXqMSgAM/L1FUxy3meZtNXXwUweoYXqW8A5wXWgCBngVS5YOhce34mBoCTh1rZychYEA3F+0ga/A+ik37evmcQtjoHBk9+N2YBgG6SsmnQeuZ1lgFLKO2nxmIplQ5sOQdA/M2fiW4yUTSL5ocT5wKBgHwY2eufQS+FGfAW+WTgn46ueM/6SH1vvWS7cWl7byNuK+58d1BMO4Y+jm8PKqmYa6O3k4M99SFlfdGPh56UVrb2nR7E3RK4H7u2R8AXJ0cHWugCjTk4jTsVdq2xXhV+Wf7/vBvBDfEmc5Ul5lmPtPwvENQDfMO7Nl7HY9sn6xFBAoGAYWqqWXGPlvjEk3rPIEAGaU1LzP4OLXiLYdXGJAekVlYTcl2gA22wnreFTnZ6aZDZykhj6OyGDt2DQFExc2PCNjPw5a7fpNNgrqEvMk4tRqNVwLCauVw6a3bWuDepkDKXylxy5L6iiPfUPxQ17x/cTexIrMIsTlZed0d/135YLesCgYB7b/QbfNjzC3ffVWGJBHhXuxxOY12AXbJ6sNQYRzXkaWEsboi6OSaNtoT5bQPPui8WcaEHTHvp90cK7SwB0ywhUIowV+0Xte9SHxYam2T/zuGgAmSuOac+JbUAFekpbv/zNyOosdOIqw4++sKTeIv2S3QtEPCL62OqdTagoPgBZg==',
  environment: 'PROD'
}

// Create PayU client
export const payuClient = new PayU({
  key: PAYU_CONFIG.key,
  salt: PAYU_CONFIG.salt,
}, PAYU_CONFIG.environment)

// Generate transaction ID (matching the working implementation)
const generateTransactionId = () => {
  return 'PAYU_MONEY_' + Math.floor(Math.random() * 8888888)
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
  // Prepare the string to hash (matching the working implementation)
  const hashString = `${PAYU_CONFIG.key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_CONFIG.salt}`

  console.log('Hash String:', hashString)

  // Calculate the hash using PayU's expected format
  const hashV1 = crypto.createHash('sha512').update(hashString).digest('hex')
  const hashV2 = crypto.createHash('sha512').update(hashString).digest('hex')
  
  // PayU expects the hash to be passed as a stringified JSON object
  const hash = JSON.stringify({
    v1: hashV1,
    v2: hashV2
  })

  console.log('Calculated Hash:', hash)

  const data = await payuClient.paymentInitiate({
    isAmountFilledByCustomer: false,
    txnid: txnid,
    amount: amount,
    currency: 'INR',
    productinfo: productinfo,
    firstname: firstname,
    email: email,
    phone: mobile,
    surl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/verify/${txnid}`,
    furl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/verify/${txnid}`,
    hash: hash
  })

  return data
}

// Verify PayU payment
export const verifyPayUPayment = async (txnid: string) => {
  const verifiedData = await payuClient.verifyPayment(txnid)
  return verifiedData.transaction_details[txnid]
}

export { PAYU_CONFIG } 