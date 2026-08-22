export type AvailabilityStatus = "open" | "limited" | "unavailable";

// Edit this one line whenever your availability changes — nothing else
// in the app needs to change.
export const currentAvailability: AvailabilityStatus = "open";

export const availabilityColors: Record<AvailabilityStatus, string> = {
  open: "#3ecf6e",
  limited: "#f5a524",
  unavailable: "#f04438",
};
