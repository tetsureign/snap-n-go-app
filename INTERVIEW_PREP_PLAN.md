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

### The "Senior" Fix
To make `React.memo` actually work, we remove Context from the child component and pass primitive props down from the parent map function.

**1. Refactor `DetectResultRenderer.tsx` (Remove Context)**
```tsx
type Props = {
  element: DetectionResultType;
  index: number;
  isReliable: boolean;
  renderType: 'button' | 'rect';
  // New props replacing context
  isSelected: boolean;       
  onSelect: (index: number) => void;
  resizeRatio: number;
};

// ... inside the component
// Remove useContext(SelectedResultContext) completely.
```

**2. Refactor `ImageDetectPage.tsx` (Handle state in the parent)**
```tsx
const DetectResult = ({fetchResult, type}: DetectResultProps) => {
  // Consume context at the parent level
  const { selectedResult, setSelectedResult, resizeRatio } = useContext(SelectedResultContext);

  // Stabilize the callback with useCallback
  const handleSelect = useCallback((index: number) => {
    setSelectedResult(prev => 
      prev.index === index ? { result: '', index: -1 } : { result: fetchResult[index].object, index }
    );
  }, [fetchResult, setSelectedResult]);

  return fetchResult.map((element, index) => {
    const isReliable = element.score >= RELIABILITY_THRESHOLD;
    const isSelected = selectedResult.index === index; // Evaluate to primitive boolean

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

*By doing this, clicking item #3 only re-renders item #3 and the previously selected item. The rest skip rendering.*

---

## Phase 2: React Native Specifics (Building Search History)
When ready to expand features, focus on mobile-specific optimization patterns.

1. **Implement `<FlatList>`:** Build the history page using React Native's `<FlatList>`.
2. **Optimize the List:** Practice implementing `keyExtractor`, `getItemLayout`, and `initialNumToRender`.
3. **Memoize Items:** Ensure the `renderItem` component is wrapped in `React.memo` and does not contain inline functions.
4. **Secure Storage:** Practice mobile auth using `expo-secure-store` instead of standard web tokens.

---

## Phase 3: Architectural Migration (React Query)
Since you already successfully implemented `@tanstack/react-query` in the `ripperdoc-shop-admin` project, migrate `SnapAndGo` to use it as well.

1. Replace the custom `useDetection.ts` logic with a `useMutation` from React Query.
2. This demonstrates the ability to standardize complex asynchronous operations (like `multipart/form-data` image uploads) across completely different platforms and architectures.
