import { useUIStore } from "@/hooks/state";
import { Button } from "../ui/button";
import { useMiners } from "@/hooks/useMiners";
import { useEffect, useMemo, useState } from "react";
import { SoundSelector, useUiSounds } from "@/hooks/useSound";
import { useDojo } from "@/dojo/useDojo";
import { Card, CardContent } from "../ui/card";
import { useAccount } from "@starknet-react/core";
import { Account } from "starknet";

import Tombstone from "@/components/icons/tombstone.svg?react";
import CoinFountain from "./CoinsStreaming";

export const Modal = () => {
  const setModal = useUIStore((state) => state.setModal);
  const modalContent = useUIStore((state) => state.modalContent);

  const {
    setup: { client },
  } = useDojo();

  const { account } = useAccount();

  const { play: playScream } = useUiSounds(SoundSelector.DWARFS_SCREAMING_IN_1);
  const { play: playYippee } = useUiSounds(SoundSelector.DWARFS_SAYING_YIPPE);
  const { allMiners } = useMiners();

  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (modalContent.mine?.mine.current_status.toString() === "Collapsed") {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000); // Stop shaking after 500ms

      playScream();
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000); // Stop shaking after 500ms
      playYippee();
    }
  }, [modalContent]);

  const [loading, setLoading] = useState(false);

  const yeildPerMiner = useMemo(() => {
    return (
      (modalContent.mine?.mine.mineral_payout || 0) /
      (modalContent.mine?.totalMiners()! || 0)
    );
  }, []);

  return (
    <div
      className={`w-screen h-screen fixed z-50 overflow-hidden bg-cover bg-center bg-no-repeat ${
        isShaking ? "shake-heavy" : ""
      }`}
      style={{ backgroundImage: `url('${modalContent.mine?.image()}')` }}
    >
      <div className="w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        {/* Coin Fountain */}

        {modalContent.mine?.mine.current_status.toString() === "Collapsed" && (
          <CoinFountain />
        )}

        <div className="container p-8 rounded-lg max-h-full overflow-y-auto">
          <div className="w-full mb-6">
            <Button onClick={() => setModal(false)}>close</Button>
          </div>

          <div className="text-3xl text-center font-arbutus w-1/2 justify-center mx-auto mb-8">
            {modalContent.content}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allMiners
              .filter(
                (miner) =>
                  miner.minerClass.miner.mine_id === modalContent.mine?.mine.id
              )
              .map((miner, index) => (
                <Card key={index} className="flex flex-col border p-4">
                  <CardContent className="flex flex-wrap items-center">
                    <div className="relative mx-auto mt-4">
                      <img
                        className={`w-14 h-14 rounded-full border transition-all duration-200 border-white/10 ${
                          miner.minerClass.status() === "Alive"
                            ? "animate-bounce"
                            : "grayscale"
                        }`}
                        src={miner.minerClass.avatar()}
                        alt=""
                      />
                      {miner.minerClass.status() === "Dead" && (
                        <div className="absolute inset-0 flex items-center justify-center w-14 h-14">
                          <Tombstone />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap">
                      <div className="text-center w-full font-arbutus">
                        {miner.minerClass.name()}
                      </div>

                      <div className="mx-auto mt-4">
                        {miner.minerClass.isAlive() &&
                          miner.minerClass.miner.mine_id ===
                            modalContent.mine?.mine.id && (
                            <Button
                              variant={"default"}
                              onClick={async () => {
                                setLoading(true);

                                await client.actions.leave_mine({
                                  account: account as Account,
                                  mine_id: modalContent.mine?.mine.id!,
                                  miner_id: miner.minerClass.miner.id || 0,
                                });
                                setLoading(false);
                              }}
                            >
                              {loading
                                ? "Withdrawing..."
                                : miner.minerClass.miner.choice.toString() ===
                                  "Selfish"
                                ? `${
                                    modalContent.mine.payoutPerMinerType()
                                      .selfish
                                  } $MINERAL`
                                : "No payout available"}
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
