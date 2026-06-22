# React Interview Prep & Optimization Plan

## Primary Goal
Practice React fundamentals and performance optimization alongside text-based interview review.

## Priority Roadmap
1. **Phase B: Pure React Core Performance** (Refactoring existing `SnapAndGo` code)
2. **Phase A: React Native Specifics** (Implementing features like Search History with `<FlatList>`)
3. **Phase C: Architectural Migration** (Replacing custom fetching hooks with `React Query`)

---

## Phase 1: Pure React Core Performance (The Context Fix)

### The Bottleneck: The Context Re-render Cascade
Currently in `SnapAndGo`, `DetectResultRenderer` is wrapped in `React.memo()`, but it consumes `SelectedResultContext` directly via `useContext`. 

In `ImageDetectPage.tsx`, the Context Provider is passed a new inline object on every render:
```tsx
<SelectedResultContext.Provider
  value={{
    selectedResult,
    setSelectedResult,
    resizeRatio,
  }}>
```

**Why this fails in interviews:**
1. `{}` creates a new object reference on every render.
2. React Context uses strict equality (`===`), so it forces all consumers to update.
3. `useContext` completely bypasses `React.memo`.
**Result:** Clicking a single bounding box causes all unselected bounding boxes and action sheet buttons to re-render.

### The "Senior" Solutions

#### Solution A: Remove Context and Prop Drill Primitives
To make `React.memo` actually work, we remove Context from the child component and pass primitive props down from the parent map function.

**1. Refactor `DetectResultRenderer.tsx` (Remove Context)**
```tsx
type Props = {
  element: DetectionResultType;
  index: number;
  isReliable: boolean;
  renderType: 'button' | 'rect';
  isSelected: boolean;       
  onSelect: (index: number) => void;
  resizeRatio: number;
};

// Remove useContext(SelectedResultContext) completely.
```

**2. Refactor `ImageDetectPage.tsx` (Handle state in the parent)**
```tsx
const DetectResult = ({fetchResult, type}: DetectResultProps) => {
  const { selectedResult, setSelectedResult, resizeRatio } = useContext(SelectedResultContext);

  const handleSelect = useCallback((index: number) => {
    setSelectedResult(prev => 
      prev.index === index ? { result: '', index: -1 } : { result: fetchResult[index].object, index }
    );
  }, [fetchResult, setSelectedResult]);

  return fetchResult.map((element, index) => {
    const isReliable = element.score >= RELIABILITY_THRESHOLD;
    const isSelected = selectedResult.index === index;

    return (
      <DetectResultRenderer
        key={index}
        element={element}
        index={index}
        isReliable={isReliable}
        renderType={type}
        isSelected={isSelected}
        onSelect={handleSelect}
        resizeRatio={resizeRatio || 1}
      />
    );
  });
};
```

#### Solution B: The Context Splitting Pattern (Advanced Context Optimization)
If prop-drilling gets too deep, interviewers will look for **Context Splitting**.
Instead of one context, split it into two:
1. `SelectedResultStateContext`: Holds only `selectedResult` and `resizeRatio`.
2. `SelectedResultDispatchContext`: Holds only `setSelectedResult`.

Since the dispatch function reference (`setSelectedResult`) never changes, components that only trigger actions (like buttons or touch handlers) will never re-render when the selected state changes.

---

## Phase 2: React Native Specifics (Building Search History)

### 1. The Dynamic Mobile Authentication Flow
In React Native, authentication isn't handled by redirecting pages. We conditionally mount navigation stacks:
```tsx
{userToken ? (
  <AppStack.Navigator>...</AppStack.Navigator>
) : (
  <AuthStack.Navigator>...</AuthStack.Navigator>
)}
```
*Practice:* Set up a conditional root navigator that checks for local tokens on mount using `expo-secure-store`.

### 2. High-Performance Virtualized Lists (`<FlatList>`)
To render search history smoothly, you must tune list virtualization:
* **`keyExtractor`:** Ensure unique stable string keys (never use index).
* **`getItemLayout`:** Provides pre-calculated item heights to React Native, bypassing dynamic layout measurements.
* **`windowSize`:** Limits the virtual scroll buffer.
* **`removeClippedSubviews`:** Frees memory by unmounting off-screen view containers (vital for memory preservation on Android).
* **`initialNumToRender` & `maxToRenderPerBatch`:** Optimizes load/scroll responsiveness.

---

## Phase 3: Architectural Migration (React Query & Offline Caching)

### 1. Standardizing Remote Mutations
Replace the manual promise chain and reducer logic inside [useDetection.ts](file:///home/nntthu/Dev/SnapAndGo/src/screens/Camera/hooks/useDetection.ts) with React Query's `useMutation`. It manages loading/error states out-of-the-box and unifies API fetching styles across your web and mobile codebases.

### 2. Paginated Fetching with `useInfiniteQuery`
On mobile, we don't click page numbers; we scroll to load more.
* **The Exercise:** Pair React Query's `useInfiniteQuery` with the `onEndReached` hook of your `<FlatList>` to fetch chunks of history dynamically.

### 3. Optimistic Updates
* **The Exercise:** Practice implementing optimistic updates (updating the UI local cache immediately, then reverting if the API post fails) for deleting search history items.

---

## Interview Questions & Self-Assessment Checkpoints

Use these mock questions to test your knowledge while coding:

### Phase 1: Core React Performance
* **Q1:** What is the difference between `React.memo` and `useMemo`?
* **Q2:** Why does a component consuming context re-render even if it is wrapped in `React.memo`? How does splitting contexts or passing down primitive props solve this?
* **Q3:** If you pass a callback function as a prop to a memoized child component, does it prevent re-renders? Why do we need `useCallback`?

### Phase 2: React Native Performance
* **Q4:** Why is loading lists using `.map()` on scrollable views bad for performance in mobile? How does `FlatList` virtualize rendering?
* **Q5:** Why does using an index as a list key harm performance and cause render bugs when items are added or removed?
* **Q6:** Explain `getItemLayout` and how it prevents layout thrashing.

### Phase 3: Data Fetching and Architecture
* **Q7:** What are the pros and cons of using a state management library (like Redux/Zustand) vs. a server cache library (like React Query)?
* **Q8:** How does React Query's stale-while-revalidate caching model work?
* **Q9:** How do you implement optimistic updates during list operations, and how do you handle rollbacks?
