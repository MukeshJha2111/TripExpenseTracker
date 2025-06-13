import React, { useState } from 'react'
import { client } from '../sanityClient'
import { Button } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import * as XLSX from 'xlsx'

export default function ExportExpenses() {
  const [downloading, setDownloading] = useState(false)

  const handleExport = async () => {
    setDownloading(true)

    try {
      const data = await client.fetch(`*[_type == "expense"]{
        title,
        amount,
        "paidBy": paidBy->name,
        "splitBetween": splitBetween[]->name,
        date
      }`)

      const formattedData = data.map(exp => ({
        Title: exp.title,
        'Amount (₹)': exp.amount,
        'Paid By': exp.paidBy,
        'Split Between': exp.splitBetween?.join(', '),
        Date: new Date(exp.date).toLocaleDateString()
      }))

      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses')

      XLSX.writeFile(workbook, 'trip_expenses.xlsx')
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<FileDownloadIcon />}
      onClick={handleExport}
      disabled={downloading}
      sx={{ mt: 2 }}
    >
      {downloading ? 'Exporting...' : 'Export to Excel'}
    </Button>
  )
}
