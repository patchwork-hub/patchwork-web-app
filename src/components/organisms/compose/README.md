# Compose form

Need to add styles to your tailwind css to show placeholder.
```css
@layer components {
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    @apply text-white/80 pointer-events-none h-0 opacity-50;
  }
}
```

### Usage
To use the compose form,
```jsx
<ComposeForm onSubmit={(values)=>{}}/>
```

To only use the TipTap editor,
```TypeScript
 const Example = () => {
    const { editor, editorjsx } = useTipTapEditor();

    // editor.getText()

    return (
        <>
            {editorjsx}
        </>
    )
 }
```