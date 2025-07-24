import { defineEventHandler, readBody } from 'h3'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Check required parameters
  const meta = body?.meta
  const validate = body?.validate

  if (!meta || typeof meta !== 'object') {
    return {
      error: "MP_meta",
      code: 400,
    }
  }

  if (!validate || typeof validate !== 'string') {
    return {
      error: "MP_validate",
      code: 400,
    }
  }

  const { issue_date, expire_date, validation_server, assembly_server } = meta

  if (!issue_date || !expire_date || !validation_server || !assembly_server) {
    return {
      error: "MMF",
      code: 400,
    }
  }

  // Convert expire date to timestamp and compare
  const expiry = new Date(expire_date.replace(/:/g, '-')).getTime()
  const now = Date.now()

  if (isNaN(expiry)) {
    return {
      error: "DT_IF",
      code: 400,
    }
  }

  if (now > expiry) {
    return {
      error: "CT_EX",
      code: 401,
    }
  }

  // Generate SHA256 of the canonical JSON string
  const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        issue_date,
        expire_date,
        validation_server,
        assembly_server
      }))
      .digest('hex')

  if (hash !== validate) {
    return {
      error: "CT_MH",
      code: 402,
    }
  }

  // Success
  return {
    status: "CT_VALID",
    expires: expire_date,
    code: 200,
  }
})
