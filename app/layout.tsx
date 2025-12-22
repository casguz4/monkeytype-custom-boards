import { Github } from "lucide-react";
import { Outlet } from "react-router";

import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";

const TITLE = "Monkey Type Custom Boards";
export default function Layout() {
  return (
    <div>
    {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⌨️</span>
            <span className="text-lg">MonkeyType Battle</span>
          </div>
          <div className="flex items-center">
          <Button className="mr-2" variant="ghost" size="sm" asChild>
            <a
              href="https://monkeytype.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              MonkeyType.com
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com/casguz4/monkeytype-custom-boards"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github />
            </a>
          </Button> 
          </div>
        </div>
      </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <Toaster />
      
        <Outlet />
          {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 size-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 size-96 bg-pink-300/20 rounded-full blur-3xl" />
      </div>
      </div>
      <footer className="bg-gray-800 text-white p-4">
        <p className="text-center">
          &copy; {new Date().getFullYear()} {TITLE}
        </p>
      </footer>
    </div>
  );
}
