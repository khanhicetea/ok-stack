import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { Link } from "@tanstack/react-router";

export default function Header() {
  // const { data: session } = useSession();

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/tanstack-query" preload="intent">
            TanStack Query
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/server-funcs">Start - Server Functions</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/api-request">Start - API Request</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/form/simple">Simple Form</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/form/address">Address Form</Link>
        </div>

        <div className="px-2 font-bold">
          <Button
            variant="link"
            onClick={() =>
              signIn.social({
                provider: "github",
              })
            }
          >
            Login
          </Button>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/form/address"></Link>
        </div>
      </nav>
    </header>
  );
}
