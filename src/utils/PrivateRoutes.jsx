import { Navigate } from "react-router-dom";
import { SIGNIN } from "../components/routes/RouteConstants";

function PrivateRoute({ element, isAuthenticated }) {
  return isAuthenticated() ? <>{element}</> : <Navigate to={SIGNIN} replace />;
}

export default PrivateRoute;
