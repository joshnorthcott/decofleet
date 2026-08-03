import * as XLSX from "xlsx"

/**
 * Generate and immediately download an .xlsx file from a flat array of row objects.
 * Column headers come from the object keys of the first row.
 * Pass `headers` to rename/reorder them: { internalKey: "Display Name" }
 */
export function downloadExcel(
  rows: Record<string, unknown>[],
  filename: string,
  sheetName = "Reporte",
  headers?: Record<string, string>,
) {
  if (rows.length === 0) return

  let data = rows
  if (headers) {
    const keys = Object.keys(headers)
    data = rows.map(row =>
      Object.fromEntries(keys.map(k => [headers[k], row[k] ?? ""]))
    )
  }

  const ws = XLSX.utils.json_to_sheet(data)

  // Auto-width columns
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(r => String(r[key] ?? "").length),
    ) + 2,
  }))
  ws["!cols"] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
