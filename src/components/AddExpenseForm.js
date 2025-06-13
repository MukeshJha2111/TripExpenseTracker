import React, { useEffect, useState } from 'react'
import { client } from '../sanityClient'
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Alert
} from '@mui/material'

export default function AddExpenseForm({ onExpenseAdded }) {
  const [users, setUsers] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitBetween, setSplitBetween] = useState([])

  const [successOpen, setSuccessOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    client.fetch(`*[_type == "user"]{_id, name}`).then(setUsers)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ✅ Validation checks
    if (!title.trim()) return setErrorMsg('Title is required.')
    if (!amount || parseFloat(amount) <= 0) return setErrorMsg('Amount must be a positive number.')
    if (!paidBy) return setErrorMsg('Please select who paid.')
    if (splitBetween.length === 0) return setErrorMsg('Select at least one person to split with.')

    const doc = {
      _type: 'expense',
      title,
      amount: parseFloat(amount),
      paidBy: {
        _type: 'reference',
        _ref: paidBy
      },
      splitBetween: splitBetween.map(id => ({
        _type: 'reference',
        _ref: id
      })),
      date: new Date().toISOString()
    }

    try {
      await client.create(doc)

      // ✅ Reset form and show success
      setTitle('')
      setAmount('')
      setPaidBy('')
      setSplitBetween([])
      setSuccessOpen(true)
      setErrorMsg('')

      if (onExpenseAdded) onExpenseAdded()
    } catch (err) {
      console.error(err)
      setErrorMsg('Something went wrong. Try again.')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        Add Expense
      </Typography>

      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Amount (₹)"
        fullWidth
        type="number"
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Paid By</InputLabel>
        <Select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          input={<OutlinedInput label="Paid By" />}
        >
          {users.map(user => (
            <MenuItem key={user._id} value={user._id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Split Between</InputLabel>
        <Select
          multiple
          value={splitBetween}
          onChange={(e) => setSplitBetween(e.target.value)}
          input={<OutlinedInput label="Split Between" />}
          renderValue={(selected) =>
            selected
              .map(id => users.find(u => u._id === id)?.name || '')
              .join(', ')
          }
        >
          {users.map(user => (
            <MenuItem key={user._id} value={user._id}>
              <Checkbox checked={splitBetween.includes(user._id)} />
              <ListItemText primary={user.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Add Expense
      </Button>

      {/* ✅ Success Message */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Expense added successfully!
        </Alert>
      </Snackbar>

      {/* ❌ Error Message */}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
