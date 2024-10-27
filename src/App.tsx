import AuthenticationSection from "./components/Authentication/AuthenticationSection";
import { Toaster } from "@/components/ui/toaster"
function App() {
  return (
    <div className="w-full overflow-x-hidden">
      
      <Toaster />
      <AuthenticationSection/>
    </div>
  );
}

export default App;
