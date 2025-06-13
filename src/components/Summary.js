import React, { useEffect, useState } from 'react'
import { client } from '../sanityClient'
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box
} from '@mui/material'

export default function Summary() {
  const [balances, setBalances] = useState([])

  useEffect(() => {
    const query = `*[_type == "expense"]{
      amount,
      paidBy->{
        _id,
        name
      },
      splitBetween[]->{
        _id,
        name
      }
    }`

    client.fetch(query).then(data => {
      const userTotals = {}

      data.forEach(exp => {
        const numPeople = exp.splitBetween.length
        const share = exp.amount / numPeople

        // Who paid
        const payerId = exp.paidBy._id
        if (!userTotals[payerId]) {
          userTotals[payerId] = { name: exp.paidBy.name, paid: 0, owes: 0 }
        }
        userTotals[payerId].paid += exp.amount

        // Who owes
        exp.splitBetween.forEach(user => {
          if (!userTotals[user._id]) {
            userTotals[user._id] = { name: user.name, paid: 0, owes: 0 }
          }
          userTotals[user._id].owes += share
        })
      })

      const summary = Object.entries(userTotals).map(([id, { name, paid, owes }]) => ({
        name,
        paid,
        owes,
        balance: paid - owes
      }))

      const debtors = summary.filter(u => u.balance < 0)
      const creditors = summary.filter(u => u.balance > 0)
      const transactions = []

      let i = 0, j = 0
      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i]
        const creditor = creditors[j]
        const amount = Math.min(Math.abs(debtor.balance), creditor.balance)

        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: amount.toFixed(2)
        })

        debtor.balance += amount
        creditor.balance -= amount

        if (Math.abs(debtor.balance) < 0.01) i++
        if (creditor.balance < 0.01) j++
      }

      setBalances(transactions)
    })
  }, [])

  return (
    <Box>
      <Typography variant="h6" gutterBottom>🤝 Who Owes Whom</Typography>

      {balances.length === 0 ? (
        <Typography>Everything is settled up! 🎉</Typography>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <List>
              {balances.map((t, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={
                      <Typography>
                        💸 <strong>{t.from}</strong> owes <strong>{t.to}</strong> ₹{t.amount}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
