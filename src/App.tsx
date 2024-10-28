import AuthenticationSection from "./components/Authentication/AuthenticationSection";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "./components/Header/NavBar";
import Home from "./components/Home/Home";
import { useState } from "react";
import { Seller } from "./lib/types";
function App() {


  const [sessionSeller, setSessionSeller] = useState<Seller | null>(null)

  return (
    <div className="w-full overflow-x-hidden">

      <Toaster />
      {sessionSeller != null ?
        <Home sellerData={sessionSeller} />
        :
        <AuthenticationSection setSeller={setSessionSeller} />
      }


    </div>
  );
}

export default App;
