import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} = useSession();
  return <Layout>
    <div className="flex justify-between">
      <h2>
        Hello,&nbsp;
        <div className="text-primary inline-block">
          <b>{session?.user?.name}</b>
        </div>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
  </Layout>
}
