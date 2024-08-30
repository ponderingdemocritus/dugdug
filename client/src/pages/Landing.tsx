import { Link } from "react-router-dom";
import { useAccount, useConnect } from "@starknet-react/core";
import { useDojo } from "@/dojo/useDojo";
import { Button } from "@/components/ui/button";

function Landing() {
  const {
    account: { account },
  } = useDojo();
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const connectWallet = async () => {
    connect({ connector: connectors[0] });
  };

  return (
    <div className="relative w-full h-screen">
      <img
        src="./bg-1.png"
        alt="Landing"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-arbutus">
            DugDug
          </h1>
          <div>
            <p className="text-2xl my-4">
              "Aye, this game be a prisoner's dilemma, but with dwarves!"
            </p>
          </div>
          <div className="text-4xl  my-8">
            <div>1. AXE</div>
            <div>2. ....</div>
            <div>3. MINERALS</div>
          </div>

          <div className="mt-8">
            {!isConnected ? (
              <Button
                className="px-4 "
                variant={"secondary"}
                size={"sm"}
                onClick={connectWallet}
              >
                Log in
              </Button>
            ) : (
              <Link
                to={"/app"}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark mt-8"
              >
                Mine
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
