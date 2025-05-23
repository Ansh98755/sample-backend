import Form from "../components/Form";

export default function Home() {
  return (
    <div className="min-h-screen grid items-center justify-items-center gap-16 p-8 pb-20 sm:p-20 font-[var(--font-geist-sans)]">
      <div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <Form />
      </div>
    </div>
  );
}