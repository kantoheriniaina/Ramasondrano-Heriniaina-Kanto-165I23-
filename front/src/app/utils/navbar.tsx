import { Bell, Home, HelpCircle, Settings, Shield, Mail, User, FileText, Lock } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function DefaultDemo() {
  const tabs = [
    { title: "Dashboard", icon: Home },
    { title: "Notifications", icon: Bell },
    { type: "separator" },
    { title: "Settings", icon: Settings },
    { title: "Support", icon: HelpCircle },
    { title: "Security", icon: Shield },
    { type: "custom", element: <ThemeToggle /> },
  ] as const ;

  return (
     <div className="w-full  flex  justify-center items-center  px-4 py-2 ">
      {/* Onglets */}
      <ExpandableTabs tabs={[...tabs]} />
    </div>
  );
}

function CustomColorDemo() {
  const tabs = [
    { title: "Profile", icon: User },
    { title: "Messages", icon: Mail },
    { type: "separator" },
    { title: "Documents", icon: FileText },
    { title: "Privacy", icon: Lock },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <ExpandableTabs 
        tabs={[...tabs]}  
        activeColor="text-blue-500"
        className="border-blue-200 dark:border-blue-800" 
      />

     
    </div>
  );
}

export { DefaultDemo, CustomColorDemo };