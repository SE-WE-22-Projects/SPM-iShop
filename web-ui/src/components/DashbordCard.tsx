import { ArrowCircleRightOutlined } from "@mui/icons-material";
import { Paper, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import { Link } from "react-router-dom";

dayjs.extend(AdvancedFormat);

const cardStyle = { display: "flex", px: "16px", py: "12px" };
const imgStyle = { alignSelf: "end", height: "394px" };

interface LinkCardProps {
  name: string;
  desc: string;
  link: string;
}

/**
 * A card that links to a page.
 */
export const LinkCard = ({
  name,
  desc,
  link,
}: LinkCardProps) => {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Paper
        elevation={3}
        sx={{ ...cardStyle, height: "94px", mr: "auto", minWidth: "80%" }}
      >
        <Box sx={{ my: "auto" }}>
          <Typography sx={{ fontSize: "1.75rem", fontWeight: 500 }}>
            {name}
          </Typography>
          <Typography sx={{ fontWeight: 500 }}>{desc}</Typography>
        </Box>
        <Box sx={{ ml: "auto", my: "auto" }}>
          <ArrowCircleRightOutlined fontSize='large' />
        </Box>
      </Paper>
    </Link>
  );
};

/**
 * A card that displays the current time and date
 */
export const DateCard = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{ ...cardStyle, minHeight: "100px", backgroundColor: "#1B508B" }}
    >
      <Box color={'#ffffff'} sx={{ my: "auto" }}>
        <Typography align="center" sx={{ fontWeight: 400 }}>Today is</Typography>
        <Typography sx={{ fontSize: "1.75rem", fontWeight: 500 }}>
          {dayjs(time).format("Do MMMM YYYY HH:mm:ss")}
        </Typography>
      </Box>
    </Paper>
  );
};

/**
 * A card that displays a welcome message, the current date and time, and a welcome image.
 */
export const WelcomeCard = ({ img }: { img: string }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        ...cardStyle,
        backgroundColor: "#cde1b4",
        mb: 4,
        minHeight: "140px",
      }}
    >
      <Box sx={{ my: "auto", mr: "130px" }}>
        <Typography
          sx={{ color: "#003a2b", fontWeight: 600, fontSize: "1.8rem" }}
        >
          Welcome Back!
        </Typography>
        <Typography sx={{ color: "#003a2b", fontSize: "1.1rem" }}>
          Have a Nice Day!
        </Typography>
        <Typography sx={{ fontWeight: 400 }}>Today is</Typography>
        <Typography sx={{ fontSize: "1.75rem", fontWeight: 500 }}>
          {dayjs(time).format("Do MMMM YYYY HH:mm:ss")}
        </Typography>
      </Box>
      <img style={imgStyle} src={img}></img>
    </Paper>
  );
};
