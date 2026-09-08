"use client";

export default function ConfirmDeleteButton({
  bookingId,
  clientName,
  action,
}: {
  bookingId: number;
  clientName: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Permanently delete this request from ${clientName}? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="bookingId" value={bookingId} />
      <button
        type="submit"
        className="text-xs font-medium text-fg-faint hover:text-fg"
      >
        Delete
      </button>
    </form>
  );
}
