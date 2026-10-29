import type { Metadata } from "next";
import { PlayGame } from "@/components/game/PlayGame";

export const metadata: Metadata = {
  title: "Today's 5",
  description: "Five situations. Your gut instinct. About a minute.",
};

export default function PlayPage() {
  return <PlayGame />;
}
