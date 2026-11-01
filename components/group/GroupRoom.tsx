"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { setFromIds } from "@/lib/game/engine";
import { buildBoard } from "@/lib/group";
import { fetchGroup, readMe, saveMe, submitToGroup, type GroupData, type Me } from "@/lib/group-client";
import { track, trackOnce } from "@/lib/analytics";
import { Game } from "@/components/game/Game";
import { GameHeader } from "@/components/game/GameHeader";
import { useLinkShare } from "@/components/game/useLinkShare";
import { ForkMark } from "@/components/ForkMark";
import { GroupBoard } from "./GroupBoard";
import { NameForm } from "./NameForm";

type State =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "off" }
  | { kind: "ready"; data: GroupData }
  | { kind: "playing"; data: GroupData; me: Me }
  | { kind: "board"; data: GroupData; me: Me | null };

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain relative min-h-dvh">
      <div className="page flex flex-col" style={{ paddingTop: "max(env(safe-area-inset-top), 14px)" }}>
        <header className="flex items-center justify-between py-3">
          <GameHeader />
        </header>
        <main className="py-8">{children}</main>
      </div>
    </div>
  );
}

export function GroupRoom({ id }: { id: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const link = useLinkShare();

  const apply = useCallback(
    (data: Awaited<ReturnType<typeof fetchGroup>>) => {
      if (data === "missing") return setState({ kind: "missing" });
      if (data === "off") return setState({ kind: "off" });
      const me = readMe(id);
      const played = me && data.members.some((m) => m.id === me.memberId);
      setState(played ? { kind: "board", data, me } : { kind: "ready", data });
    },
    [id],
  );
  const load = useCallback(() => fetchGroup(id).then(apply), [id, apply]);

  useEffect(() => {
    let alive = true;
    fetchGroup(id).then((d) => {
      if (alive) apply(d);
    });
    return () => {
      alive = false;
    };
  }, [id, apply]);

  const board = useMemo(() => (state.kind === "board" ? buildBoard(state.data.group, state.data.members) : null), [state]);

  useEffect(() => {
    if (board) trackOnce(`group-board:${id}:${board.members.length}`, "group_board_viewed", { members: board.members.length });
  }, [board, id]);

  const invite = () =>
    void link.shareLink(`/g/${id}`, "Who's who in our group? Play the same five on Instinct and see:");

  if (state.kind === "loading") {
    return (
      <Page>
        <p className="small faint" aria-live="polite">
          Opening the group…
        </p>
      </Page>
    );
  }

  if (state.kind === "missing" || state.kind === "off") {
    return (
      <Page>
        <ForkMark size={36} className="olive" />
        <h1 className="display mt-5" style={{ fontSize: "clamp(2rem, 8vw, 2.75rem)" }}>
          {state.kind === "missing" ? "That group has gone." : "Groups are having a lie-down."}
        </h1>
        <p className="mt-4 muted" style={{ maxWidth: "44ch" }}>
          {state.kind === "missing"
            ? "Groups last 30 days, or the link might have been cut off. Start a new one in a few taps."
            : "We couldn't reach the group right now. Try again in a minute, or play today's five on your own."}
        </p>
        <div className="mt-8 grid gap-3" style={{ maxWidth: "24rem" }}>
          <Link href="/g/new" className="btn btn-block">
            Start a new group <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/play" className="btn btn-ghost btn-block">
            Play today&rsquo;s 5
          </Link>
        </div>
      </Page>
    );
  }

  if (state.kind === "ready") {
    const { group, members } = state.data;
    const me = readMe(id);
    return (
      <Page>
        <p className="small olive font-semibold">{group.host}&rsquo;s group</p>
        <h1 className="display mt-1.5" style={{ fontSize: "clamp(2.1rem, 9vw, 3rem)" }}>
          Who&rsquo;s who in the group chat?
        </h1>
        <p className="mt-3 muted" style={{ maxWidth: "40ch" }}>
          Everyone plays the same five situations. Then you see each other&rsquo;s aura, who&rsquo;s most alike, and who&rsquo;s the
          wildcard.
        </p>
        <p className="small faint mt-3">
          {members.length === 0
            ? "Nobody has played yet. You're first."
            : `${members.length} played so far: ${members.map((m) => m.name).join(", ")}.`}
        </p>
        <div className="mt-6" style={{ maxWidth: "24rem" }}>
          <NameForm
            label="Your name, so the group knows who's who"
            cta="Play the five"
            initial={me?.name ?? ""}
            onSubmit={(name) => {
              const saved = saveMe(id, name);
              track("group_joined", { members_before: members.length });
              setState({ kind: "playing", data: state.data, me: saved });
            }}
          />
        </div>
      </Page>
    );
  }

  if (state.kind === "playing") {
    const round = setFromIds(state.data.group.roundIds) ?? [];
    return (
      <>
        <Game
          mode="group"
          round={round}
          dateKey={state.data.group.dateKey}
          headRight={undefined}
          onComplete={async (records) => {
            const after = await submitToGroup(
              id,
              state.me,
              records.map((r) => r.choiceId),
            );
            if (!after) {
              setSaveError(true);
              return;
            }
            setState({ kind: "board", data: after, me: state.me });
          }}
        />
        {saveError ? (
          <div className="toast" role="alert">
            Couldn&rsquo;t save to the group. Check your connection and tap the button again.
          </div>
        ) : null}
      </>
    );
  }

  return board ? (
    <GroupBoard
      board={board}
      host={state.data.group.host}
      meId={state.me?.memberId}
      onInvite={invite}
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
      }}
      toast={link.toast}
    />
  ) : null;
}
