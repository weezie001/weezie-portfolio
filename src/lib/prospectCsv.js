const FIELD_ALIASES = {
  name: ['name', 'contact', 'contact name', 'full name', 'first name', 'person'],
  email: ['email', 'e-mail', 'email address'],
  business: ['business', 'company', 'company name', 'business name', 'brand'],
  website: ['website', 'site', 'url', 'website url', 'domain'],
  niche: ['niche', 'industry', 'sector', 'category'],
}

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
  return headers.findIndex((header) => FIELD_ALIASES[field].includes(header.trim().toLowerCase()))
}

export function parseProspectCsv(input) {
  const rows = parseRows(String(input || '').replace(/^\uFEFF/, ''))
  if (rows.length === 0) return []

  const headerIndexes = Object.fromEntries(
    Object.keys(FIELD_ALIASES).map((field) => [field, findHeaderIndex(rows[0], field)]),
  )
  const hasHeader = headerIndexes.email >= 0
  const records = hasHeader ? rows.slice(1) : rows
  const indexFor = {
    name: hasHeader ? headerIndexes.name : 0,
    email: hasHeader ? headerIndexes.email : 1,
    business: hasHeader ? headerIndexes.business : 2,
    website: hasHeader ? headerIndexes.website : 3,
    niche: hasHeader ? headerIndexes.niche : 4,
  }

  return records.flatMap((record) => {
    const value = (field) => {
      const index = indexFor[field]
      return index >= 0 ? String(record[index] || '').trim() : ''
    }
    const email = value('email').toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return []

    return [{
      name: value('name') || 'Founder',
      email,
      business: value('business') || email.split('@')[1].split('.')[0],
      website: value('website'),
      niche: value('niche'),
    }]
  })
}
