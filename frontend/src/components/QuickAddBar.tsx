type QuickAddBarProps = {
  onSubmit: (label: string) => Promise<void>;
  busy: boolean;
};

export function QuickAddBar({ onSubmit, busy }: QuickAddBarProps) {
  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const label = String(new FormData(form).get("label") ?? "").trim();
    if (!label) return;
    await onSubmit(label);
    form.reset();
  };

  return (
    <form className="quick-add" onSubmit={handleSubmit}>
      <input
        name="label"
        type="text"
        placeholder="What needs to get done?"
        disabled={busy}
        required
      />
      <button type="submit" disabled={busy}>
        {busy ? "Adding..." : "+ Add"}
      </button>
    </form>
  );
}
