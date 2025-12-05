import './App.css';
import LightRays from './components/LightRays';
import Header2 from './components/header2';
import backgroundImg from './assets/background.jpg';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
import ParallaxSection from './components/ParallaxSection';
import ScrollRevealContainer from './components/ScrollRevealContainer';
import ScrollReveal from './components/ScrollReveal';
import ModelViewer from './components/3dcar';

function App() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator 
        position="top-left"
        showPhase={true}
        showFrequency={true}
        baseFrequency={16}
        frequencyMultiplier={0.2}
      />

      {/* Hero Section với background fixed */}
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Header2 />
        </div>
      </div>

      {/* Section 2: Model & Text với Parallax Background */}
      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
        overlayColor="rgba(0,0,0,0.8)"
        parallaxSpeed={30}
        enableParallax={true}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '80px 20px'
        }}>
          <ScrollRevealContainer
            baseOpacity={0.1}
            enableBlur={true}
            baseRotation={3}
            blurStrength={8}
            baseY={150}
          >
            <ModelViewer
              url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
              width={400}
              height={400}
            />
          </ScrollRevealContainer>

          <div style={{ marginTop: '60px', maxWidth: '800px', color: '#fff' }}>
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur={true}
              baseRotation={3}
              blurStrength={4}
            >
              When does a man die? When he is hit by a bullet? No! When he suffers a disease?
              No! When he ate a soup made out of a poisonous mushroom?
              No! A man dies when he is forgotten!
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* Section 3: Another Section */}
      <ParallaxSection
        backgroundImage="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80"
        overlayColor="rgba(0,0,0,0.75)"
        parallaxSpeed={25}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#fff', maxWidth: '800px' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 6vw, 72px)',
              fontWeight: '800',
              marginBottom: '30px'
            }}>
              Another Amazing Section
            </h2>
            <p style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              lineHeight: '1.8',
              opacity: 0.8
            }}>
              Add more content here with smooth parallax scrolling effect
            </p>
          </div>
        </div>
      </ParallaxSection>

      {/* Footer */}
      <ParallaxSection
        backgroundGradient="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
        minHeight="50vh"
        enableParallax={false}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '40px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>Footer Content</h3>
            <p style={{ fontSize: '16px', opacity: 0.8 }}>
              © 2024 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
}

export default App;