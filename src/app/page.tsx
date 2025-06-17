"use client"

import { useRouter } from "next/navigation";
import { http } from "@/lib/http-common";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userIdSystem = "dab3e7ab-9569-48c7-ae2c-52ef2596b251";

    const fetchToken = async () => {
      const res = await http.get(`/users/getToken/${userIdSystem}`);
      const data = res.data;

      // Guarda no localStorage a porra do token e do ID
      localStorage.setItem('token', data);
      localStorage.setItem('updatedById', userIdSystem);

      // Redireciona usando o router do lado do cliente
      router.push("/users/list");
    };

    fetchToken();
  }, [router]);

  return (
    <div className="p-4 text-lg font-bold">
      Pegando o token da desgraça, aguenta aí...
    </div>
  );
}
