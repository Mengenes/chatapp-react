import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import Navbar from "./Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function ChatSkeleton() {
  return (
    <Card className="w-full h-dvh shadow-2xl flex flex-col rounded-xs bg-secondary overflow-hidden">
      <Navbar />

      <div className="flex flex-row flex-1 p-3 bg-secondary gap-2 overflow-hidden">
        <ScrollArea className="w-full max-w-50 min-h-[32dvh] border rounded-2xl bg-background">
          <div>
            <h3 className="font-bold mb-2 text-center border-b p-3 bg-primary text-secondary">
              Users
            </h3>

            <div className="p-2 space-y-2 animate-pulse">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border p-3 hover:bg-gray-200"
                >
                  <div className="h-4 w-32 bg-muted rounded-full" />
                  <div className="h-3 w-12 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="w-full max-w-screen flex flex-col gap-1">
          <div className="overflow-y-auto border p-2 rounded-2xl h-full animate-pulse space-y-1">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 w-full max-w-dvw p-2">
                <div className="h-4 w-20 bg-muted rounded-full shrink-0" />
                <div className="h-4 flex-1 bg-muted rounded-full" />
                <div className="h-4 w-10 bg-muted rounded-full ml-auto" />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input disabled placeholder="Type..." />
            <Button disabled>Send</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ChatSkeleton;