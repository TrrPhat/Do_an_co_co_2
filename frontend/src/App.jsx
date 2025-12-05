import './App.css';
import LightRays from './components/LightRays';
import Header2 from './components/header2';
import backgroundImg from './assets/background.jpg';


function App() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#01010155"
            raysSpeed={2}
            lightSpread={0.8}
            rayLength={1.9}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.05}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
      </div>
      <Header2 />
    </div>
  );
}

export default App;