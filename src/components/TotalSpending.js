import React, { useEffect, useState } from "react";
import { client } from "../sanityClient";
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Divider,
  Stack,
  useMediaQuery,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { useTheme } from "@mui/material/styles";

export default function TotalSpending() {
  const [summary, setSummary] = useState({ total: 0, byUser: [] });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const query = `*[_type == "expense"]{
      amount,
      paidBy->{_id, name}
    }`;

    client.fetch(query).then((data) => {
      let total = 0;
      const contributions = {};

      data.forEach((exp) => {
        total += exp.amount;
        const id = exp.paidBy._id;
        if (!contributions[id]) {
          contributions[id] = { name: exp.paidBy.name, amount: 0 };
        }
        contributions[id].amount += exp.amount;
      });

      setSummary({
        total,
        byUser: Object.values(contributions).sort(
          (a, b) => b.amount - a.amount
        ),
      });
    });
  }, []);

  return (
    <Box mt={4}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        🧾 Trip Spending Summary
      </Typography>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#fefefe",
        }}
      >
        <CardContent>
          <Stack
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="space-between"
            spacing={2}
            mb={2}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: "#444",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <MonetizationOnIcon color="success" />
              Total Spent:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#00796b",
                fontWeight: "bold",
              }}
            >
              ₹{summary.total.toFixed(2)}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            💳 Who Contributed
          </Typography>

          <List dense>
            {summary.byUser.map((u, i) => (
              <ListItem key={i} sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#00796b" }}>
                    {u.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 500 }}>{u.name}</Typography>
                  }
                  secondary={`Contributed ₹${u.amount.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
