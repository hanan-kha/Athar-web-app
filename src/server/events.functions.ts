export const listSavedEventIds = async () => ({ ids: [] as string[] });
export const toggleSavedEvent = async ({ data }: { data: { eventId: string; saved: boolean } }) => ({ saved: !data.saved });
export const registerForEvent = async () => { const ref = `REF-${Date.now().toString(36).toUpperCase()}`; return { ok: true, bookingId: ref, qr: ref, total: 0, currency: "GBP", reference: ref }; };
