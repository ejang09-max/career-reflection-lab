import { StudentEntryForm } from "@/components/StudentEntryForm";

export default function HomePage() {
  return (
    <main className="campus-grid min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <StudentEntryForm />
      </div>
    </main>
  );
}
