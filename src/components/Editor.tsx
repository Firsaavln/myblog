'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Editor({ onChange }: { onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Mulai menulis...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] border p-4 rounded-xl',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2 border-b pb-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="px-3 py-1 bg-gray-100 rounded">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-3 py-1 bg-gray-100 rounded">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-3 py-1 bg-gray-100 rounded">H2</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}