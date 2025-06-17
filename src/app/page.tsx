import { redirect } from "next/navigation";
import { http } from "@/lib/http-common";

export default async function Home() {
    const userIdSystem = "dab3e7ab-9569-48c7-ae2c-52ef2596b251";

          const res = await http.get(`/users/getToken/${userIdSystem}`)
          const data = res.data;
    
          localStorage.setItem('token', data);
          localStorage.setItem('updatedById', userIdSystem);
    return redirect("/users/list")
}