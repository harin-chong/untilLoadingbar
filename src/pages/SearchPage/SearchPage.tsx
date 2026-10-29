import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const categories = [
  { name: "Pop", color: "#e13300" },
  { name: "Hip-Hop", color: "#7358ff" },
  { name: "Rock", color: "#e91429" },
  { name: "K-pop", color: "#148a08" },
  { name: "R&B", color: "#503750" },
  { name: "Electronic", color: "#477d95" },
  { name: "Indie", color: "#e8115b" },
  { name: "Jazz", color: "#ba5d07" },
];

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed) {
      navigate(`/search/${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, color: "white" }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Search
      </Typography>

      <TextField
        fullWidth
        placeholder="What do you want to play?"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch(keyword);
          }
        }}
        sx={{
          maxWidth: 500,
          mb: 4,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            borderRadius: 8,
            color: "black",
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "black" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Browse all
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {categories.map((category) => (
          <Box
            key={category.name}
            onClick={() => {
              setKeyword(category.name);
              handleSearch(category.name);
            }}
            sx={{
              height: 120,
              p: 2,
              borderRadius: 2,
              backgroundColor: category.color,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SearchPage;