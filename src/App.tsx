import { useState } from "react";
import { InterestsOutlined, ViewQuiltOutlined } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
  colors,
} from "@mui/material";

import type { SxProps, Theme } from "@mui/material";
import KonvaStage from "./components/KonvaStage";

const LIST_MENU = [
  {
    label: "Template",
    icon: ViewQuiltOutlined,
  },
  {
    label: "Elements",
    icon: InterestsOutlined,
  },
];

function App() {
  const [selectedMenu, setSelectedMenu] = useState(LIST_MENU[0].label);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={(theme) => ({
          zIndex: theme.zIndex.drawer + 1,
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        })}
      >
        <Toolbar>
          <Typography variant="h6">
            Simple image editing with Konva (not optimized for mobile)
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={(theme) => ({
          width: "72px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            border: 0,
            background: "#252627",
            color: theme.palette.primary.contrastText,
          },
        })}
      >
        <Toolbar />
        <List disablePadding>
          {LIST_MENU.map((item) => {
            const sxSelected: SxProps<Theme> = (() => {
              if (selectedMenu === item.label) {
                return {
                  background: colors.grey[800],
                  opacity: 1,
                  ":before, :after": {
                    content: `""`,
                    position: "absolute",
                    display: "block",
                    height: "16px",
                    width: "16px",
                    right: 0,
                    background: `radial-gradient(circle closest-side, transparent 0%, transparent 50%, ${colors.grey[800]} 0) 200% 200% / 400% 400%`,
                  },
                  ":before": {
                    top: "-16px",
                  },
                  ":after": {
                    bottom: "-16px",
                    transform: "scaleY(-1)",
                  },
                };
              }
              return {
                opacity: 0.6,
                "&:hover": {
                  opacity: 1,
                },
              };
            })();

            return (
              <ListItem
                key={item.label}
                disablePadding
                sx={{ display: "block", ...sxSelected }}
              >
                <ListItemButton
                  disableTouchRipple
                  disableRipple
                  disableGutters
                  sx={{
                    fontSize: "1.75em",
                    width: 72,
                    height: 72,
                    flexDirection: "column",
                    justifyContent: "center",
                    "&:hover": {
                      background: "transparent",
                    },
                  }}
                  onClick={() => {
                    setSelectedMenu(item.label);
                  }}
                >
                  {<item.icon fontSize="inherit" />}
                  <Typography variant="caption" flexGrow={0} fontSize={10}>
                    {item.label}
                  </Typography>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Box
            sx={{
              width: "20em",
              bgcolor: "grey.800",
              color: "primary.contrastText",
              p: 3,
            }}
          >
            <Typography>TODO LIST:</Typography>
            <Typography variant="body2">1. Add Save</Typography>
            <Typography variant="body2">2. Delete Stickers</Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "grey.200",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ bgcolor: "white", boxShadow: 2 }}>
              <Typography variant="body1" px={2} py={1}>
                List of tools goes here
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, position: "relative" }}>
              <KonvaStage />
            </Box>
            <Box sx={{ bgcolor: "white", boxShadow: 2 }}>
              <Typography variant="body1" px={2} py={1}>
                List of tools goes here
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
