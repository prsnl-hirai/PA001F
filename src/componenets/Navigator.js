import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import ScheduleIcon from "@mui/icons-material/Schedule";
// import DnsRoundedIcon from "@material-ui/icons/DnsRounded";
import TimerIcon from "@mui/icons-material/Timer";
import SettingsIcon from "@mui/icons-material/Settings";
import ComputerIcon from "@mui/icons-material/Computer";

import personal_logo from "../public/company_name_logo_white.png";

import { atndRegist, atndApproval, adminAnth } from "../common/Global";

const item = {
  py: "7px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

// interface ListItemProps {
//   setSelectedMenuIndex: (newState: number) => void;
// }
// type CombinedProps = DrawerProps & ListItemProps;

export default function Navigator(props) {
  const { ...other } = props;
  const navigate = useNavigate();
  const categories = useMemo(() => {
    return [
      {
        id: "atndRegist",
        isShow: atndRegist,
        children: [
          {
            index: 0,
            title: "勤怠登録 / 実績参照",
            icon: <ScheduleIcon />,
            path: "/atndRegist",
            active: false,
          },
          {
            index: 1,
            title: "勤務パターン登録",
            icon: <ScheduleIcon />,
            path: "/patternRegist",
            active: false,
          },
        ],
      },
      {
        id: "skillSheet",
        isShow: atndRegist,
        children: [
          {
            index: 2,
            title: "スキルシート入力",
            icon: <ComputerIcon />,
            path: "/skillsheet",
            active: false,
          },
        ],
      },
      {
        id: "admin",
        isShow: adminAnth || atndApproval,
        children: [
          {
            index: 3,
            title: "勤怠管理",
            icon: <TimerIcon />,
            path: "/atndAdmin",
            active: false,
          },
          {
            index: 4,
            title: "スキルシート出力",
            icon: <SettingsIcon />,
            path: "/",
            active: false,
          },
          {
            index: 5,
            title: "給与明細登録",
            icon: <SettingsIcon />,
            path: "/",
            active: false,
          },
          {
            index: 6,
            title: "設定",
            icon: <SettingsIcon />,
            path: "/",
            active: false,
          },
        ],
      },
    ];
  }, []);

  return (
    <Drawer variant="permanent" {...other}>
      <Typography
        variant="h4"
        noWrap
        component="div"
        style={{
          alignItems: "center",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        <img
          src={personal_logo}
          style={{
            height: "32px",
            margin: "20px",
          }}
        />
      </Typography>
      <List disablePadding>
        {categories
          .filter((c) => c.isShow)
          .map(({ id, children }) => (
            <Box key={id} sx={{ bgcolor: "#101F33" }}>
              {children.map(({ index, title, icon, path, active }) => (
                <ListItem disablePadding key={index}>
                  <ListItemButton
                    selected={active}
                    sx={item}
                    onClick={() => {
                      categories.forEach((ca) => {
                        ca.children.forEach((ch) => {
                          if (ch.index === index) {
                            ch.active = true;
                          } else {
                            ch.active = false;
                          }
                        });
                      });

                      navigate(path);
                    }}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{title}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
            </Box>
          ))}
      </List>
    </Drawer>
  );
}
