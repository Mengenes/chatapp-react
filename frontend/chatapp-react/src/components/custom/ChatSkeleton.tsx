import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import Navbar from "./Navbar";

function ChatSkeleton() {
  return (
    <Card className="w-full h-dvh flex flex-col bg-secondary overflow-hidden rounded-none">
      <Navbar />

      <div className="flex flex-1 overflow-hidden gap-2 p-3">
        
        <ScrollArea className="w-44 sm:w-52 md:w-60 lg:w-64 border rounded-xl overflow-hidden bg-background">
          <div>
            <h3 className="font-bold text-center border-b p-3 bg-primary text-secondary">
              Users
            </h3>

            <div className="flex flex-col animate-pulse p-2 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border p-3 rounded-md"
                >
                  <div className="h-4 w-full maw-w-40 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-col flex-1 min-w-0 gap-2">
          
          <div className="flex-1 overflow-y-auto border rounded-xl p-3 bg-background animate-pulse space-y-4">
            
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 min-w-0">
                
                <div className="h-4 w-16 sm:w-20 bg-muted rounded-full shrink-0" />
                
                <div className="flex-1 h-4 bg-muted rounded-full" />
              </div>
            ))}

          </div>

          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-muted rounded-md" />
            <div className="w-16 sm:w-20 h-10 bg-muted rounded-md" />
          </div>

        </div>
      </div>
    </Card>
  );
}

export default ChatSkeleton;