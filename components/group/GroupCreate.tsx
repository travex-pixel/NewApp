"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGroup, saveMe } from "@/lib/group-client";
import { track } from "@/lib/analytics";
import { NameForm } from "./NameForm";

export function GroupCreate() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      <NameForm
        label="What should the group call you?"
        cta="Create the group"
        busy={busy}
        onSubmit={async (name) => {
          setBusy(true);
          setError(null);
          const id = await createGroup(name);
          if (!id) {
            setBusy(false);
            setError("Couldn't create a group right now. Try again in a minute.");
            return;
          }
          saveMe(id, name);
          track("group_created", {});
          router.push(`/g/${id}`);
        }}
      />
      {error ? (
        <p className="small accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
