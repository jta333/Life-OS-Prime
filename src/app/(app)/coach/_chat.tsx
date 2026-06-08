"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp, Loader2, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn, initials } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Props {
  initialMessages: ChatMessage[];
  aiEnabled: boolean;
  isDemo: boolean;
  userName?: string | null;
}

const STARTERS = [
  "Audit my routine and tell me where the biggest leverage point is.",
  "What's my single biggest risk this week, burnout, energy, or focus?",
  "Build me a 7-day plan to fix my mornings.",
  "Where am I leaking time, and what should I cut first?",
];

export function CoachChat({ initialMessages, aiEnabled, isDemo, userName }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.length
      ? initialMessages
      : [
          {
            role: "assistant",
            content: `Welcome${
              userName ? `, ${userName.split(" ")[0]}` : ""
            }. I have your latest scores, habits, and check-ins. What do you want to lock in today?`,
          },
        ]
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(next);
    setInput("");
    setSending(true);

    if (!aiEnabled) {
      // Friendly canned response
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "AI coach is offline, add an `ANTHROPIC_API_KEY` to enable streaming responses. In the meantime, here's a deterministic principle: protect the **first 90 minutes** of your morning for one high-leverage task, and shut down screens by 22:30. Compound those two and most other metrics follow.",
          },
        ]);
        setSending(false);
      }, 600);
      return;
    }

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("Coach request failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't reach coach");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[72vh] flex-col">
      <div className="border-b border-border/40 px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Sparkles className="size-3.5 text-gold" /> Coach session
          {isDemo && (
            <Badge variant="violet" className="ml-2">
              Demo
            </Badge>
          )}
          {!aiEnabled && !isDemo && (
            <Badge variant="secondary" className="ml-2">
              No API key
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-luxury px-4 py-6 md:px-8">
        <div className="mx-auto max-w-3xl space-y-5">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} userName={userName} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin text-gold" />
              Coach is thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {messages.length <= 1 && (
        <div className="border-t border-border/40 px-4 py-3 md:px-8">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border/40 px-4 py-4 md:px-8"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask your coach for an audit, a routine, a plan…"
            className="min-h-[52px] resize-none"
          />
          <Button type="submit" size="icon" disabled={sending || !input.trim()}>
            {sending ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  userName,
}: {
  role: "user" | "assistant" | "system";
  content: string;
  userName?: string | null;
}) {
  if (role === "system") return null;
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          isUser
            ? "bg-gradient-to-br from-cyan/60 to-violet/40 ring-1 ring-cyan/30"
            : "bg-gradient-to-br from-gold to-amber/80 ring-1 ring-gold/40 text-[oklch(0.18_0.02_70)]"
        )}
      >
        {isUser ? initials(userName) : <Sparkles className="size-3.5" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-cyan/10 text-foreground ring-1 ring-cyan/20"
            : "bg-card/60 text-foreground ring-1 ring-border/60"
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: (p) => <h3 className="mt-2 mb-1 font-semibold tracking-tight" {...p} />,
            h3: (p) => <h4 className="mt-2 mb-1 text-xs uppercase tracking-wider text-muted-foreground" {...p} />,
            ul: (p) => <ul className="my-2 ml-5 list-disc space-y-1" {...p} />,
            ol: (p) => <ol className="my-2 ml-5 list-decimal space-y-1" {...p} />,
            code: ({ className, children, ...p }) => (
              <code className={cn("rounded bg-foreground/[0.07] px-1.5 py-0.5 font-mono text-[12px] text-gold", className)} {...p}>
                {children}
              </code>
            ),
            table: (p) => (
              <div className="my-3 overflow-hidden rounded-lg border border-border/60">
                <table className="w-full text-xs" {...p} />
              </div>
            ),
            th: (p) => <th className="border-b border-border/60 bg-card/60 px-2 py-1.5 text-left text-[10px] uppercase tracking-wider text-muted-foreground" {...p} />,
            td: (p) => <td className="border-b border-border/40 px-2 py-1.5 last:border-0" {...p} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
