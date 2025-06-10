"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.push("/sign-in");
  return (
   <div>
    Hey
   </div>
  );
}
