"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMessage from "@/lib/renderEventMessage";

const storiesPath = "public/stories";

function StoryWriter() {
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState("");
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null); 
  const [currentTool, setCurrentTool] = useState("");
  const [events, setEvents] = useState<Frame[]>([]);
  
  
  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);

    const response = await fetch("/api/run-script" , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: storiesPath }),
    });

    if (response.ok && response.body){
      // handle streams from API
      // ...
      console.log("Streaming started");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      handleStream(reader, decoder);

    } else {
      setRunFinished(true);
      setRunStarted(false);
      console.error("Failed to start streaming");
    }
  }

  async function handleStream(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder){
    // manage the stream from API...
    while(true) {
      const {done, value} = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, {stream: true} );

      const eventData = chunk
      .split("\n\n")
      .filter((line) => line.startsWith("event:"))
      .map((line) => line.replace(/^event: /, ""));

      eventData.forEach(data => {
        try {
            const parsedData = JSON.parse(data);
            if (parsedData.type === "callProgress"){
              setProgress(
              parsedData.output[parsedData.output.length - 1].content
              );
              setCurrentTool(parsedData.tool?.description || "");
            }else if (parsedData.type === "callStart"){
              setCurrentTool(parsedData.Tool?.description || "");
            }else if (parsedData.type === "runFinish"){
             setRunFinished(true);
             setRunStarted(false);
            } else {
              setEvents((prevEvents) => [...prevEvents, parsedData]);
            }
            } catch (error) {
              console.error("Failed to parse JSON", error);
            }
      });
    }
  }


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

        <Button disabled={!story || !pages} className="w-full" size="lg"
             onClick={runScript}
        >
          Create the imaginary world
        </Button>
      </section>

      <section  className="flex-1 pb-5 mt-5">
        <div className="flex flex-col-reverse w-full space-y-2 bg-blue-300 rounded-md text-black font-mono p-10 h-96 overflow-y-auto">
            <div>
               {runFinished === null && (
                   <>
                  <p className="animate-pulse mr-5">
                    I'm waiting for you to create your world of imagination above...
                  </p>
                  <br />
                  </>
               )}

              <span className="mr-5">{">"}</span>
               {progress}
            </div>

            {/* Current Tool */}
            {currentTool && (
              <div>
                <span className="mr-5">{"---[Current Tool] ---"}</span>
                {currentTool}
              </div>

            )}
              {/* Render the events... */}
              <div className="space-y-5">
                {events.map((event, index) => (
                  <div key={index}>
                      <span className="mr-5">{">>"}</span>
                      {renderEventMessage(event)}
                  </div>
                ))}
              </div>

              {runStarted && (
                <div>
                  <span className="mr-5 animate-in">
                    {"--- [AI Storyteller Has Started] ---"}
                  </span>
                  <br />
                </div>
              )}

        </div>
      </section> 
    </div>
  );
}

export default StoryWriter;
