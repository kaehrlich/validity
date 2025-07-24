# Validity Verification Service

Live instances:

- https://validity.crashdebug.dev
- https://validity-three.vercel.app

This is a minimal Nitro backend for certificate verification.

## API Endpoint

### POST `/verify`

Verifies the integrity, validity, and expiration of a mutual certificate.

#### Request Format (JSON)

```json
{
  "meta": {
    "issue_date": "YYYY-MM-DD",
    "expire_date": "YYYY-MM-DD",
    "validation_server": "string",
    "assembly_server": "string"
  },
  "validate": "sha256-hash-string"
}
```

- `issue_date`: Original date of issuance, in `YYYY-MM-DD` format.
- `expire_date`: Expiry date, in `YYYY-MM-DD` format.
- `validation_server`: The domain used for validation.
- `assembly_server`: Domain of the entity that assembled the certificate.
- `validate`: SHA256 hash of the canonical JSON `{ issue_date, expire_date, validation_server, assembly_server }`.

#### Success Response

```json
{
  "status": "CT_VALID",
  "expires": "YYYY-MM-DD",
  "code": 200
}
```

#### Failure Responses

| Code | Meaning         | Description                                        |
|------|-----------------|----------------------------------------------------|
| 400  | MP_meta         | Missing or malformed `meta` field                  |
| 400  | MP_validate     | Missing or malformed `validate` field              |
| 400  | MMF             | One or more meta fields are missing                |
| 400  | DT_IF           | Invalid date format in `expire_date`               |
| 401  | CT_EX           | Certificate is expired                             |
| 402  | CT_MH           | Certificate hash does not match expected value     |

All errors return the following structure:

```json
{
  "error": "ERROR_CODE",
  "code": HTTP_STATUS
}
```

## Local Development

To run the project locally:

```bash
npm install
npm run dev
```
