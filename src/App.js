import SignIn from "./componenets/SignIn";
import Info from "./componenets/Info";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./componenets/Main";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/login`} Component={SignIn} />
        {/* <Route path={`/login/updatePassword`} Component={UpdatePassword} /> */}
        <Route path={`/`} Component={Main}>
          <Route index Component={Info} />
          {/*  <Route path="/atndRegist" Component={AtndRegist} />
          <Route path="/patternRegist" Component={PatternRegist} />
          <Route path="/atndAdmin" Component={AtndAdminMain} />
          <Route path="/atndAdmin/unapproved" Component={AtndApprovalDetail} />
          <Route path="/skillsheet" Component={SkillSheetMain} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
