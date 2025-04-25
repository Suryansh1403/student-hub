"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UploadButton } from "@/utils/uploadthing";
export default function NoteUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isPublic, setIsPublic] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  const [key, setKey] = useState("");


  const handleSubmit = async () => {
    const note = {
      title,
      description,
      isPublic,
   key
    };

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow space-y-4">
      <h2 className="text-2xl font-bold">Upload Note</h2>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        placeholder="Short description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />


      <div className="flex items-center gap-2">
        <Label htmlFor="isPublic">Make Public?</Label>
        <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
      </div>


      {/* Upload PDF/Code file */}
      <div>
        <Label className="block mb-2">Upload PDF or Code File</Label>
        <UploadButton
      
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        setKey(res[0].key)
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
      
      />
        {key.length>0 && <p className="text-green-600 mt-2 text-sm">✅ File uploaded!</p>}
      </div>

      <Button onClick={handleSubmit}>Submit Note</Button>
    </div>
  );
}



