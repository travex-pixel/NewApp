import type { Metadata } from "next";
import { PlayGame } from "@/components/PlayGame";

export const metadata: Metadata = {
  title: "Play",
  description: "Five real situations. Choose, see what happens, keep the one idea worth keeping.",
};

export default function PlayPage() {
  return <PlayGame />;
}
