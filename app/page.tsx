import Image from "next/image";
import Logo from "@/images/logo.png";

export default function Home() {
  return (
    <main className="">
      <section>
        <div>
          <Image src={Logo} height={250} alt="Logo" />
        </div>
      </section>
      
    </main>
  );
}
