export function formatMessageTime(date) {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }



export function formatMessageDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()

  const diffInMs = now - date
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  if (diffInDays < 7) {
    // Return day of the week (e.g., Mon, Tue)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  } else {
    // Return full formatted date (e.g., March 23, 2024)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
}
