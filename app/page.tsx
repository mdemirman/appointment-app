import { Header } from "@/components/header";
import { QueueDisplay } from "@/components/queue-display";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-background">
      <Header />
      <main>
        <QueueDisplay />
      </main>
    </div>
  );
}
