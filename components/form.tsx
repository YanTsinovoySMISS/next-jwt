import { useState } from "react";
import SignIn from "./signin";
import SignUp from "./signup";

export default function Form() {
  const [isSignInMode, setSignInMode] = useState<boolean>(false);
  return (
    <div>
      {isSignInMode ? (
        <SignIn setSignInMode={setSignInMode} />
      ) : (
        <SignUp setSignInMode={setSignInMode} />
      )}
    </div>
  );
}
