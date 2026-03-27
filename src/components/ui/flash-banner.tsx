type FlashBannerProps = {
  notice?: string;
  error?: string;
};

export function FlashBanner({ notice, error }: FlashBannerProps) {
  if (!notice && !error) {
    return null;
  }

  const isError = Boolean(error);
  const message = error ?? notice;

  return (
    <div
      className={
        isError
          ? "rounded-3xl border border-[rgba(180,35,24,0.18)] bg-[rgba(180,35,24,0.08)] px-5 py-4 text-sm font-medium text-danger"
          : "rounded-3xl border border-[rgba(47,106,97,0.18)] bg-[rgba(47,106,97,0.08)] px-5 py-4 text-sm font-medium text-green"
      }
    >
      {message}
    </div>
  );
}
