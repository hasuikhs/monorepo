import { Button } from '@monorepo/ui';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <Button variant="primary" >Click me</Button>
      <button className="bg-red-500 px-4 py-2 rounded-md">Click me</button>
    </div>
  );
}
