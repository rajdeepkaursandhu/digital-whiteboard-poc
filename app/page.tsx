import Canvas from './components/Canvas';
import ClockWidget from './components/ClockWidget';

export default function Home() {
  return (
    <main className="full-screen">
      <Canvas />
      <ClockWidget />
    </main>
  );
}
