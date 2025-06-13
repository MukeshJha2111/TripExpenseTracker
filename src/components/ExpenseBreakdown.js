import React, { useEffect, useState } from "react";
import { client } from "../sanityClient";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";

export default function ExpenseBreakdown() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const query = `*[_type == "expense"]{
      title,
      amount,
      paidBy->{_id, name},
      splitBetween[]->{_id, name},
      _createdAt
    } | order(_createdAt asc)`;
    client.fetch(query).then(setExpenses);
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        📊 Detailed Expense Breakdown
      </Typography>

      {expenses.map((exp, i) => {
        const share = exp.amount / exp.splitBetween.length;

        return (
          <Card key={i} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">
                📦 {exp.title} — ₹{exp.amount}
              </Typography>
              <Typography>
                🙋 Paid by: <strong>{exp.paidBy.name}</strong>
              </Typography>
              <Typography>
                👥 Split between:{" "}
                {exp.splitBetween.map((u) => u.name).join(", ")}
              </Typography>
              <Typography>➗ Each owes: ₹{share.toFixed(2)}</Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="body2" fontWeight="bold">
                💳 Balance impact:
              </Typography>
              <Typography>
                • {exp.paidBy.name}: paid ₹{exp.amount}, owes ₹
                {share.toFixed(2)} → net +₹{(exp.amount - share).toFixed(2)}
              </Typography>
              {exp.splitBetween
                .filter((u) => u._id !== exp.paidBy._id)
                .map((user) => (
                  <Typography key={user._id}>
                    • {user.name}: paid ₹0, owes ₹{share.toFixed(2)} → net -₹
                    {share.toFixed(2)}
                  </Typography>
                ))}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
