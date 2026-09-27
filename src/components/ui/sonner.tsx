import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "bg-card text-card-foreground border-border shadow-card font-sans",
          title: "text-foreground",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
