# Tool showcase image-generation guide

This guide keeps showcase visuals consistent whether they are produced by Codex, Claude, ChatGPT, another image model, or a designer.

## 1. Collect verified source material

Before generating anything, collect the CMS record, project description, screenshots, video, supported software, original software logo, tool type, known inputs, actions, outputs, and measured impact. Do not infer numerical claims or technical capabilities from appearance alone. Mark missing facts as unknown.

The CMS must provide a controlled `toolType` value: `plugin`, `procedure`, `agent`, `ai-model`, `chatbot`, `mcp`, or `tool`. Use that term in generic headings and navigation. A company, client, or project name must never replace the tool type.

## 2. Reduce the project to one factual flow

Write a single input → action → result statement. Example:

`Open Revit model → check against 22 L1 requirements → create verified certification record`

Every object in the visual must support this flow. Remove anything decorative that does not improve understanding.

## 3. Create two different visual depths

### Hero visual

- Purpose: communicate the complete idea in three to five seconds.
- Use three or four large stages.
- Keep labels to two to five words.
- Use generous edge safety margins and a quiet lower-left area for overlapping HTML text.
- Keep all key objects above the overlap boundary.
- Prefer one visual object per stage and avoid UI screenshots unless the interface itself is the subject.

### Explanatory visual

- Purpose: explain one level deeper without becoming a technical diagram.
- Show verified inputs, the central tool action, and the output.
- Use restrained bubbles, checklist groups, connectors, screenshots, software cues, and status indicators.
- Include only exact counts that are present in the CMS.
- Limit embedded text to four short labels. Put sentences and captions in HTML, where they remain editable and accessible.

## 4. Shared art direction

- Wide 16:9 composition with at least 8% clear space on the left and right.
- White or very pale technical background.
- Isometric or lightly dimensional architectural objects.
- Revit blue for scanning and active states; restrained green only for verified outcomes.
- Soft shadows, glass and silver materials, and controlled contrast.
- No people, marketing slogans, fake dashboards, decorative particles, or cropped edge objects.
- Use the original software logo as a separate project asset; do not ask an image model to redraw a corporate wordmark.

## 5. Prompt template

```text
Use case: infographic-diagram
Asset type: [hero visual | explanatory visual] for a premium tool-showcase page
Tool type: [CMS toolType]
Verified flow: [input] → [action] → [result]
Verified facts: [counts, platform, outputs]
Reference images: [label each as style reference, screenshot reference, or edit target]
Style: refined isometric technical infographic; pale architectural background; soft blue, silver, and restrained green
Composition: wide 16:9; all objects fully contained; generous side margins; responsive-safe; [hero only: quiet lower-left overlap zone]
Text (verbatim): [maximum four short labels]
Constraints: visual understanding first; no invented facts; no marketing claims; no people; no watermark; do not redraw corporate wordmarks
```

## 6. Media captions

Write captions as factual actions tied to the visible screen: “Open the model and click Run,” “Review the five quality gates,” or “Create the certification record.” Do not write generic captions such as “Powerful workflow.”

## 7. Validation before publishing

1. Compare every label and count with the CMS source.
2. Check that the correct tool type is used throughout the page.
3. Confirm original software logos are used as separate assets.
4. Verify no important object is cropped at either edge.
5. Verify the hero overlap does not cover any stage or label.
6. Check desktop, tablet, and 390px mobile layouts.
7. Confirm embedded text remains legible; move longer copy to HTML.
8. Confirm measured impact appears only when validated data exists; otherwise use a qualitative statement.

