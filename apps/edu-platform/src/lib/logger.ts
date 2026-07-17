type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  event: string;
  [key: string]: unknown;
}

export function log(entry: LogEntry) {
  const output = { ...entry, timestamp: new Date().toISOString() };
  switch (entry.level) {
    case "error":
      console.error(JSON.stringify(output));
      break;
    case "warn":
      console.warn(JSON.stringify(output));
      break;
    default:
      console.log(JSON.stringify(output));
  }
}
