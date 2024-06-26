import { BookOpen, FilePen } from "lucide-react";
import Link from "next/link";

function Header() {
  return (
   <header className="relative p-16 text-center">
    <Link href='/'>
         <h1 className="text-6xl font-black">StoryTeller AI</h1>
         <div className="flex justify-center whitespace-nowrap space-x-5 text-3xl lg:text-5xl">
            <h2>Bringing your imagination</h2>
            <div className="relative">
                <div className="absolute bg-blue-300 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-bottom-0 md:-right-3 -rotate-1"/>
                    
                    <p className="relative text-white">To Life!</p>
                </div>
         </div>
    </Link>
    
    {/* Nav icons*/}
    <div className="absolute -top-5 right-5 flex space-x-2">
        <Link href="/">
          <FilePen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-pink-500 mt-10 border border-pink-500 p-2 rounded-md hover:opacity-50 cursor-pointer" />
        </Link>

        <Link href='/stories'>
           <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 mx-auto text-pink-500 mt-10 border border-pink-500 p-2 rounded-md hover:opacity-50 cursor-pointer" />
        </Link>
    </div>
  </header>
  );
}

export default Header;
