import { useDojo } from "@/dojo/useDojo";
import { defineComponentSystem } from "@dojoengine/recs";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const HaikuMessages = () => {
  const { setup } = useDojo();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [promptMessages, setPromptMessages] = useState<
    Array<{ message: string; timestamp: Date }>
  >([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promptMessages]);

  useEffect(() => {
    defineComponentSystem(
      setup.world,
      setup.contractComponents.PromptMessage,
      (update) => {
        const newMessage = {
          message: update.value[0]?.prompt,
          timestamp: new Date((update.value[0]?.timestamp || 0) * 1000),
        };
        console.log(newMessage);
        setPromptMessages((prevMessages: any) => {
          const updatedMessages = [...prevMessages, newMessage];
          return updatedMessages.sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
          );
        });
      }
    );
  }, []);

  return (
    <Card>
      <CardHeader className="border-b-2 border-red-700 text-center text-red-700 text-2xl font-normal tracking-wider mb-7 pb-4">
        <CardTitle>俳句メッセージ 🖌️</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto pr-2 flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {promptMessages.map((messageObj, index) => (
          <Card
            key={index}
            className="my-2 p-4 bg-white/70 border border-tan-400 shadow-md rounded-lg relative"
          >
            <CardContent className="whitespace-pre-wrap text-gray-700 leading-6 text-center">
              {messageObj.message}
            </CardContent>
            <CardContent className="text-xs text-red-700 mt-3 text-right italic">
              {messageObj.timestamp.toLocaleString()}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
