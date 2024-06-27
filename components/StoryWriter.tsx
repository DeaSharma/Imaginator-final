"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";



function StoryWriter() {
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>();

  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col border border-purple-300 rounded-md p-10 space-y-2">
        <Textarea
         value={story}
         onChange={(e) => setStory(e.target.value)}
         className="flex-1 text-black" 
         placeholder="Write a story about a girl and her two dogs..."
        />

        <Select onValueChange={value => setPages(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="How long do you want your imagination to be?"/>
            </SelectTrigger>

            <SelectContent className="w-full">
              {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i} value={String(i + 1)}>{i + 1}
                    </SelectItem>
              ))}
            </SelectContent>
        </Select>

        <Button disabled={!story || !pages} className="w-full" size="lg" >
          Create the imaginary world
        </Button>
      </section>

      <section  className="flex-1 pb-5 mt-5"></section> 
    </div>
  );
}

export default StoryWriter;
