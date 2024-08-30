import { CircleUser, Menu, Package2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Mine from "./pages/Mine";
import Leaderboard from "./pages/Leaderboard";
import Shop from "./pages/Shop";
import Tavern from "./pages/Tavern";
import Dashboard from "./pages/Dashboard";
import { Outlet } from "react-router-dom";
import { useEvents } from "./hooks/useEvents";
import { useBalances } from "./hooks/useBalances";
import { useTheme } from "@/components/theme-provider";
import { Modal } from "./components/modules/Modal";
import { useUIStore } from "./hooks/state";
import { useMiners } from "./hooks/useMiners";
import { useDojo } from "./dojo/useDojo";
import { ScrollArea } from "@/components/ui/scroll-area";

import Axe from "@/components/icons/axe.svg?react";
import ShopIcon from "@/components/icons/shop.svg?react";
import ForgeIcon from "@/components/icons/forge.svg?react";
import LeaderboardIcon from "@/components/icons/leaderboard.svg?react";
import TavernIcon from "@/components/icons/travern.svg?react";
import Diamond from "@/components/icons/diamond.svg?react";
import { HaikuMessages } from "./components/modules/MessagePrompt";

const linksConfig = [
  { icon: ForgeIcon, label: "Dashboard" },
  { icon: TavernIcon, label: "Tavern" },
  { icon: ShopIcon, label: "Shop" },
  { icon: Axe, label: "Mine" },
  { icon: LeaderboardIcon, label: "Leaderboard" },
];

function App() {
  const [page, setPage] = useState("Dashboard");
  const { setTheme } = useTheme();

  const {
    setup: { client },
    account,
  } = useDojo();

  const {} = useEvents();

  const renderLinks = (links: any) =>
    links.map(({ icon: Icon, label, badge }: any) => (
      <a
        key={label}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 border cursor-pointer hover:bg-primary  font-arbutus ${
          label === page ? "bg-muted " : ""
        } transition-all`}
        onClick={() => setPage(label)}
      >
        <Icon className="h-4 w-4" />
        {label}
        {badge && (
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {badge}
          </Badge>
        )}
      </a>
    ));

  const renderPage = () => {
    switch (page) {
      case "Leaderboard":
        return <Leaderboard />;
      case "Mine":
        return <Mine />;
      case "Shop":
        return <Shop />;
      case "Tavern":
        return <Tavern />;
      default:
        return <Dashboard />;
    }
  };

  const { readableAxeBalance, readableMineralBalance } = useBalances();

  const { myAliveMiners, myDeadMiners } = useMiners();

  const modal = useUIStore((state) => state.modal);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
      {modal && <Modal />}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold font-arbutus uppercase"
            >
              <span className="">dugdug</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid grid-cols-1 gap-2 items-start px-2 text-sm font-medium lg:px-4">
              {renderLinks(linksConfig)}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-full">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed top-0 w-full z-10 md:relative md:top-auto md:w-auto">
          {/* <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {renderLinks(linksConfig)}
              </nav>
            </SheetContent>
          </Sheet> */}
          <Button
            onClick={() =>
              client.actions.buy_axe({ account: account.account, qty: 1 })
            }
          >
            <Axe className="w-8 mr-3" />
            $AXE: {readableAxeBalance}
          </Button>
          <Button onClick={() => setPage("Shop")}>
            <Diamond className="w-8 mr-3" />
            $MINERAL: {readableMineralBalance.toLocaleString()}
          </Button>

          <Button
            onClick={() => setPage("Tavern")}
            className="border  p-2 flex gap-2"
          >
            <img className="w-6 h-6 " src="./dwarf_01.png" alt="" />
            Alive: {myAliveMiners.length}
          </Button>
          <Button
            onClick={() => setPage("Tavern")}
            className="border  p-2 flex gap-2"
          >
            <img className="w-6 h-6 " src="./dwarf_01.png" alt="" />
            Dead: {myDeadMiners.length}
          </Button>

          <div className="w-full flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <img className="w-8 h-8 rounded" src="./dwarf_01.png" alt="" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Wallet</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <HaikuMessages />

        <main className="flex flex-1 flex-col gap-4 py-4 lg:gap-6 lg:p-6 mt-14 md:mt-0 overflow-y-auto">
          <ScrollArea className="">{renderPage()}</ScrollArea>
        </main>
        <div className="z-50 left-0 right-0 shadow-md border-t flex justify-around items-center h-16 md:hidden fixed bottom-0 w-full md:relative md:w-auto bg-primary">
          {[
            { pageName: "Dashboard", Icon: ForgeIcon },
            { pageName: "Shop", Icon: ShopIcon },
            { pageName: "Mine", Icon: Axe },
            { pageName: "Leaderboard", Icon: LeaderboardIcon },
            { pageName: "Tavern", Icon: TavernIcon },
          ].map(({ pageName, Icon }) => (
            <Button
              key={pageName}
              onClick={() => setPage(pageName)}
              className={`flex flex-col items-center ${
                pageName === page ? "bg-muted " : ""
              }`}
            >
              <Icon className="h-8 w-8" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
