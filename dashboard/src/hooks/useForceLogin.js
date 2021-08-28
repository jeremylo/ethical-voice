import { useAuth } from "../auth/use-auth";
import useMountEffect from "./useMountEffect";


const useForceLogin = () => {
    const auth = useAuth();
    useMountEffect(() => { if (auth && auth.refresh) { auth.refresh(); } });
}

export default useForceLogin;
