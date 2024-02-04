import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "../store";

export const useUser = (redirectLocation: string = "/login") => {
  const { id, token } = useAppSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (token === null) {
      router.replace({
        pathname: redirectLocation,
        query: {
          from: router.pathname,
        },
      });
    }
  }, [token, router, redirectLocation]);

  return id;
};
