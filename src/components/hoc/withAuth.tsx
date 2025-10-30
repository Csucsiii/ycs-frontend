import { useAuth } from "../../providers/AuthProvider";
import { Navigate } from "react-router";
import Loading from "../Loading/Loading";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
        const { user, loading } = useAuth();

        if (loading) {
            return <Loading />;
        }

        if (!user) {
            return <Navigate to="/login" replace />;
        }

        return <Component {...props} />;
    };
}
