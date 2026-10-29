import type { Metadata } from "next";
import { DailyGame } from "@/components/DailyGame";

export const metadata: Metadata = {
  title: "Today's situation",
  description: "One situation a day. Everyone gets the same one. It changes at midnight UTC.",
};

export default function DailyPage() {
  return <DailyGame />;
}
