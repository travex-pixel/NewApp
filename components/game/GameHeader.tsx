import { Wordmark } from "@/components/Wordmark";
import { SoundToggle } from "@/components/SoundToggle";

export function GameHeader({ right }: { right?: React.ReactNode }) {
  return (
    <>
      <Wordmark />
      <div className="flex items-center gap-2.5">
        {right}
        <SoundToggle />
      </div>
    </>
  );
}
