import React, { useState } from "react";
import "./App.css";
import { Container, Typography, Divider, Box } from "@mui/material";
import UserList from "./components/UserList";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import TotalSpending from "./components/TotalSpending";
import ExportExpenses from "./components/ExportExpenses";

function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const triggerRefresh = () => setRefreshFlag((prev) => !prev);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f8fafc, #e2e8f0)",
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          background: "#ffffff",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: 4,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          💸 Trip Expense Tracker
        </Typography>

        <Divider sx={{ marginY: 3 }} />

        <Box className="section" sx={{ marginBottom: 4 }}>
          <UserList />
        </Box>

        <Divider sx={{ marginY: 3 }} />

        <Box className="section" sx={{ marginBottom: 2 }}>
          <TotalSpending key={refreshFlag} />
        </Box>

        <ExportExpenses />

        <Divider sx={{ marginY: 3 }} />

        <Box className="section" sx={{ marginBottom: 2 }}>
          <Summary key={refreshFlag} />
        </Box>

        <Box className="section" sx={{ marginBottom: 4 }}>
          <AddExpenseForm onExpenseAdded={triggerRefresh} />
        </Box>

        <Divider sx={{ marginY: 3 }} />

        <Box className="section" sx={{ marginBottom: 4 }}>
          <ExpenseList key={refreshFlag} />
        </Box>

        <Divider sx={{ marginY: 3 }} />
      </Container>
    </Box>
  );
}

export default App;
