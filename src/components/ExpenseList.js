import React, { useEffect, useState } from "react";
import { client } from "../sanityClient";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const query = `*[_type == "expense"]{
      _id,
      title,
      amount,
      date,
      paidBy->{
        name
      },
      splitBetween[]->{
        name
      }
    } | order(date desc)`;

    client.fetch(query).then(setExpenses);
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📋 All Expenses
      </Typography>

      {expenses.length === 0 ? (
        <Typography>No expenses yet!</Typography>
      ) : (
        <Grid container spacing={2}>
          {expenses.map((exp) => (
            <Grid item xs={12} sm={6} key={exp._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{exp.title}</Typography>
                  <Typography color="text.secondary">
                    ₹{exp.amount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    🙋 Paid by: <strong>{exp.paidBy?.name}</strong>
                  </Typography>
                  <Typography variant="body2">
                    👥 Split between:{" "}
                    {exp.splitBetween.map((u) => u.name).join(", ")}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    {new Date(exp.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
