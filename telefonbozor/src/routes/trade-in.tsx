import { createFileRoute } from "@tanstack/react-router";
import { TradeInCalculator } from "@/components/site/TradeInCalculator";

export const Route = createFileRoute("/trade-in")({
  component: TradeInPage,
});

function TradeInPage() {
  return (
    <div className="py-8 min-h-[85vh]">
      <TradeInCalculator />
    </div>
  );
}