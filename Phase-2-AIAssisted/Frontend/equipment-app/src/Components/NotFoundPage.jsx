import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                textAlign: "center",
                gap: 2,
            }}
        >
            <Box
                sx={{
                    bgcolor: "#f5f5f5",
                    p: 5,
                    borderRadius: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    width: "100%",
                    animation: "fadeIn 0.7s ease-in-out",
                    "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(20px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                    },
                }}
            >
                <Box component="img"
                    src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                    alt="404"
                    sx={{ width: 250, mb: 3 }}
                />
                <ErrorOutlineIcon
                    sx={{
                        fontSize: 100,
                        color: "primary.main",
                        mb: 2,
                    }}
                />
                <Typography
                    variant="h2"
                    fontWeight={700}
                    color="text.primary"
                    gutterBottom
                >
                    404
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Oops! The page you’re looking for doesn’t exist.
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                    It might have been removed, renamed, or did not exist in the first place.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/")}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                        ":hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                        },
                    }}
                >
                    Go Back Home
                </Button>
            </Box>
        </Container>
    );
}
