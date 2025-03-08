export function formatMessageTime(date) {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }