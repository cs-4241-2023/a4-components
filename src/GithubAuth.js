import { useEffect } from "react";

function GithubAuth() {
  useEffect(() => {
    window.location.href = "/auth/github";
  }, []);

  return null;
}

export default GithubAuth;
