
import React from "react";

import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

interface CardProps {
  image: string;
  title: string;
  subtitle: string;
}

const Card = ({ image, title, subtitle }: CardProps) => {
  return (
    <MuiCard
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          objectFit: "cover",
        }}
      />

      <CardContent>
        <Typography
          variant="h6"
          component="h3"
          noWrap
          title={title}
          fontWeight={600}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          title={subtitle}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </MuiCard>
  );
};

export default Card;
