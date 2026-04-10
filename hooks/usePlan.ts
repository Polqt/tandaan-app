import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { Plan } from "@/types/billing";

// Listens to the user's plan in Firestore in real-time so the UI updates
// immediately after a successful PayMongo payment.
export function usePlan(): { plan: Plan; isLoading: boolean } {
  const { user, isLoaded } = useUser();
  const [plan, setPlan] = useState<Plan>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user?.id) {
      setIsLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.id), (snap) => {
      const data = snap.data();
      setPlan(data?.plan === "pro" ? "pro" : "free");
      setIsLoading(false);
    });

    return unsub;
  }, [user?.id, isLoaded]);

  return { plan, isLoading };
}
