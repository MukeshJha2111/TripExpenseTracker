import React, { useEffect, useState } from "react";
import { client } from "../sanityClient";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    client.fetch(`*[_type == "user"]{_id, name}`).then(setUsers);
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        <GroupIcon fontSize="small" /> Trip Members
      </Typography>

      <Grid container spacing={2}>
        {users.map((user, index) => (
          <Grid item xs={6} sm={3} key={user._id}>
            <Card
              variant="outlined"
              sx={{
                textAlign: "center",
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: `hsl(${(index * 75) % 360}, 70%, 60%)`,
                    margin: "0 auto",
                    width: 56,
                    height: 56,
                    fontWeight: "bold",
                  }}
                >
                  {user.name[0].toUpperCase()}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{ marginTop: 1, fontWeight: 500 }}
                >
                  {user.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
