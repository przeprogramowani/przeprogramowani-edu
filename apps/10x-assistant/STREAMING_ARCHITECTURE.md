# Streaming Architecture

This document explains the streaming implementation for progressive query results in the 10x-assistant application.

## Overview

The application now supports streaming responses, allowing users to see progressive results as they become available:

1. **Relevant lessons found** - Shows which lessons are being searched
2. **Source references** - Displays source materials as they're retrieved
3. **Answer streaming** - Streams the LLM response word-by-word
4. **Proper cleanup** - Handles disconnections and component unmounts

## Architecture

### 1. Query Service Layer (`10x-rag/src/lib/query-service.ts`)

**New Types:**
```typescript
export type QueryProgress =
  | { type: 'lessons'; data: { relevantLessons: RelevantLesson[]; accessibleRelevant: RelevantLesson[] } }
  | { type: 'chunks'; data: { chunks: Hit[]; sourceLessons: string[] } }
  | { type: 'answer_chunk'; data: { chunk: string } }
  | { type: 'answer_complete'; data: { answer: string } }
  | { type: 'error'; data: { message: string } }
  | { type: 'complete'; data: QueryResult };
```

**New Function:**
- `executeQueryStream()` - Async generator that yields progress events
- Uses Vercel AI SDK's `streamText()` for LLM streaming
- Maintains backward compatibility with `executeQuery()` for non-streaming use cases

### 2. Service Layer

#### RAG Service (`src/services/ragRetrievalService.ts`)
- `processQuery()` - Original non-streaming implementation (kept for compatibility)
- `processQueryStream()` - New streaming implementation that:
  - Consumes `executeQueryStream()` from query-service
  - Transforms events into SSE format
  - Maps data structures for the UI

#### Claude Agent Service (`src/services/claudeAgentService.ts`)
- `processQuery()` - Original implementation
- `processQueryStream()` - Streaming implementation with simulated streaming
- TODO: Replace with actual Claude streaming API when implemented

### 3. API Endpoints

#### Non-Streaming (Legacy)
- `/api/rag` - Returns complete JSON response
- `/api/agent` - Returns complete JSON response

#### Streaming (New)
- `/api/rag-stream` - Server-Sent Events (SSE) stream
- `/api/agent-stream` - Server-Sent Events (SSE) stream

**Features:**
- Proper error handling for client disconnections
- `cancel()` handler for cleanup when client aborts
- Try-catch around `enqueue()` to detect disconnections early

### 4. Client-Side Hook (`src/hooks/useStreamingQuery.ts`)

**Purpose:** Manages streaming query state and handles SSE consumption

**Features:**
- AbortController for canceling requests
- Automatic cleanup on unmount
- Progressive state updates as events arrive
- Error handling with proper abort detection

**State:**
```typescript
interface StreamingState {
  isStreaming: boolean;
  currentAnswer: string;
  lessons: StreamingLesson[];
  sources: StreamingSource[];
  error: string | null;
}
```

**Methods:**
- `executeQuery(query)` - Start a streaming query
- `reset()` - Reset state and abort any active request
- `abort()` - Manually abort the current request

### 5. UI Components

#### ConversationPanel (`src/components/ConversationPanel.tsx`)
- Uses `useStreamingQuery` hook
- Updates messages in real-time as streaming progresses
- Shows progressive loading states:
  - "Searching for relevant lessons…"
  - "Finding relevant content…"
  - "Generating answer…"
  - "Streaming response…"
- Displays lesson count during search

#### ChatApp (`src/components/ChatApp.tsx`)
- Updated to use streaming endpoints (`/api/rag-stream`, `/api/agent-stream`)

## Event Flow

### RAG Pipeline

```
User submits query
    ↓
Frontend: useStreamingQuery.executeQuery()
    ↓
API: /api/rag-stream
    ↓
Service: processQueryStream()
    ↓
Query Service: executeQueryStream()
    ↓
Events emitted:
    1. lessons → { relevantLessons, accessibleRelevant }
    2. chunks → { chunks, sourceLessons }
    3. answer_chunk (multiple) → { chunk: "..." }
    4. answer_complete → { answer: "..." }
    5. complete → { response, sources }
    ↓
Frontend: State updates trigger UI re-renders
```

## Cleanup & Cancellation

### Client-Side Cleanup

1. **Component Unmount:**
   ```typescript
   useEffect(() => {
     return () => {
       abortControllerRef.current?.abort();
     };
   }, []);
   ```

2. **New Query:**
   - Aborts previous request before starting new one
   - Prevents multiple simultaneous requests

3. **Manual Reset:**
   - User clicks "Clear" button
   - Calls `reset()` which aborts active requests

### Server-Side Cleanup

1. **Client Disconnection Detection:**
   ```typescript
   try {
     controller.enqueue(encoder.encode(event));
   } catch (enqueueError) {
     console.log('Client disconnected, stopping stream');
     break;
   }
   ```

2. **Cancel Handler:**
   ```typescript
   cancel(reason) {
     console.log('Stream cancelled by client:', reason);
   }
   ```

3. **Prevents Resource Waste:**
   - Stops LLM generation when client disconnects
   - Releases ChromaDB connections
   - Cleans up async generators

## SSE Format

All streaming responses follow Server-Sent Events format:

```
event: lessons
data: {"lessons": [...]}

event: sources
data: {"sources": [...]}

event: answer_chunk
data: {"chunk": "Hello "}

event: answer_chunk
data: {"chunk": "world!"}

event: complete
data: {"response": "...", "sources": [...]}
```

## Benefits

1. **Better UX:**
   - Users see progress immediately
   - No "black box" waiting period
   - Clear indication of what's happening

2. **Performance:**
   - First results appear faster
   - Perceived performance improvement
   - Can show sources while answer is still generating

3. **Resource Efficiency:**
   - Proper cleanup prevents resource leaks
   - Aborted requests stop processing immediately
   - No wasted API calls or database queries

4. **Reliability:**
   - Handles network interruptions gracefully
   - Automatic cleanup on page refresh
   - No lingering connections

## Future Improvements

1. **Retry Logic:**
   - Add automatic retry for failed streams
   - Exponential backoff for transient errors

2. **Progress Indicators:**
   - Show progress bars for known operations
   - Estimated time remaining

3. **Caching:**
   - Cache lesson selections for similar queries
   - Resume from cached sources if available

4. **Real Claude Streaming:**
   - Replace simulated agent streaming with actual Claude API
   - Support for tool use events
   - Reasoning step visualization

## Testing

### Manual Testing

1. **Normal Flow:**
   - Submit query
   - Verify progressive updates
   - Check final result

2. **Cancellation:**
   - Submit query
   - Click "Clear" before completion
   - Verify cleanup in console

3. **Rapid Queries:**
   - Submit multiple queries quickly
   - Verify only last query completes
   - Check for resource cleanup

4. **Page Refresh:**
   - Submit query
   - Refresh page mid-stream
   - Check server logs for cancellation

5. **Network Issues:**
   - Throttle network in DevTools
   - Verify graceful handling
   - Check error states

## Debugging

### Client-Side Logs
```javascript
console.log('[useStreamingQuery] Cleaning up: aborting active request');
console.log('[useStreamingQuery] Manually aborting request');
```

### Server-Side Logs
```javascript
console.log('[rag-stream] Client disconnected, stopping stream');
console.log('[rag-stream] Stream cancelled by client:', reason);
console.log('[agent-stream] Client disconnected, stopping stream');
console.log('[agent-stream] Stream cancelled by client:', reason);
```

## Migration Guide

### From Non-Streaming to Streaming

**Before:**
```typescript
const { data } = await fetch('/api/rag', {
  method: 'POST',
  body: JSON.stringify({ query }),
});
```

**After:**
```typescript
const { state, executeQuery } = useStreamingQuery('/api/rag-stream');
await executeQuery(query);
// Access state.currentAnswer, state.sources, etc.
```

### Adding New Streaming Endpoints

1. Create async generator in service layer
2. Yield SSE-formatted strings
3. Create API endpoint with ReadableStream
4. Add cancel handler for cleanup
5. Update UI to use `useStreamingQuery` hook

