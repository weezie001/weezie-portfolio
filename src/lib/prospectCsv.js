const FIELD_ALIASES = {
  name: ['name', 'contact', 'contact name', 'full name', 'first name', 'person', 'owner', 'owner name'],
  email: ['email', 'e-mail', 'email address', 'e-mail address', 'contact email', 'business email', 'email id'],
  business: ['business', 'company', 'company name', 'business name', 'brand', 'organization', 'organisation'],
  website: ['website', 'site', 'url', 'website url', 'domain', 'web address'],
  niche: ['niche', 'industry', 'sector', 'category', 'business type'],
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_PATTERN = /^(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)+(?:[/:?#].*)?$/i

function parseRows(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"' && field.length === 0) {
      quoted = true
    } else if (char === ',') {
      row.push(field.trim())
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (quoted) throw new Error('The CSV has an unclosed quoted field.')
  row.push(field.trim())
  if (row.some(Boolean)) rows.push(row)
  return rows
}

function findHeaderIndex(headers, field) {
  const normalize = (value) => value.toLowerCase().replace(/[_-]+/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
  const aliases = FIELD_ALIASES[field].map(normalize)
  return headers.findIndex((header) => aliases.includes(normalize(header)))
}

function inferHeaderlessRecord(record) {
  const values = record.map((value) => String(value || '').trim())
  const emailIndex = values.findIndex((value) => EMAIL_PATTERN.test(value))
  if (emailIndex < 0) return null

  const email = values[emailIndex].toLowerCase()
  const beforeEmail = values.slice(0, emailIndex).filter((value) => value && !/^\d+$/.test(value))
  const afterEmail = values.slice(emailIndex + 1).filter(Boolean)
  const websiteIndex = afterEmail.findIndex((value) => URL_PATTERN.test(value))
  const website = websiteIndex >= 0 ? afterEmail[websiteIndex] : ''
  const business = afterEmail.find((value) => value !== website && !/^\d+$/.test(value)) || ''
  const remaining = afterEmail.filter((value) => value !== website && value !== business && !/^\d+$/.test(value))
  const name = beforeEmail[beforeEmail.length - 1] || ''
  const niche = remaining[0] || ''

  return {
    name: name || 'Founder',
    email,
    business: business || email.split('@')[1].split('.')[0],
    website,
    niche,
  }
}

export function parseProspectCsv(input) {
  const rows = parseRows(String(input || '').replace(/^\uFEFF/, ''))
  if (rows.length === 0) return []

  const headerIndexes = Object.fromEntries(
    Object.keys(FIELD_ALIASES).map((field) => [field, findHeaderIndex(rows[0], field)]),
  )
  const hasHeader = headerIndexes.email >= 0
  if (!hasHeader) return rows.flatMap((record) => {
    const prospect = inferHeaderlessRecord(record)
    return prospect ? [prospect] : []
  })

  const records = rows.slice(1)
  const indexFor = {
    name: headerIndexes.name,
    email: headerIndexes.email,
    business: headerIndexes.business,
    website: headerIndexes.website,
    niche: headerIndexes.niche,
  }

  return records.flatMap((record) => {
    const value = (field) => {
      const index = indexFor[field]
      return index >= 0 ? String(record[index] || '').trim() : ''
    }
    const email = value('email').toLowerCase()
    if (!EMAIL_PATTERN.test(email)) return []

    return [{
      name: value('name') || 'Founder',
      email,
      business: value('business') || email.split('@')[1].split('.')[0],
      website: value('website'),
      niche: value('niche'),
    }]
  })
}

export function exportToCsv(filename, rows, columns) {
  if (!rows || rows.length === 0) return false
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""'
    const str = String(val).replace(/"/g, '""')
    return `"${str}"`
  }

  const headerLine = columns.map((col) => escapeCell(col.label || col.key)).join(',')
  const dataLines = rows.map((row) =>
    columns
      .map((col) => escapeCell(typeof col.accessor === 'function' ? col.accessor(row) : row[col.key]))
      .join(','),
  )

  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}

