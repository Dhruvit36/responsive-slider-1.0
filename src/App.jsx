import { SliderProvider } from './context/SliderContext';
import SliderEngine from './components/SliderEngine';

const App = () => {
  return (
    <SliderProvider>
      <div className="w-full h-screen">
        <SliderEngine 
          className="w-full h-screen"
        />
      </div>
    </SliderProvider>
  );
};

export default App;
