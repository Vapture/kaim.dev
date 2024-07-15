import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '../../lib';

import { ThreeTunnel } from './tunel';
import Text from './Text';

const Example3 = () => {
  return (
    <ThreeTunnel.In>
      <Text />
      <EffectComposer>
        <Fluid
          radius={0.03}
          curl={10}
          swirl={5}
          distortion={1}
          force={2}
          pressure={0.94}
          densityDissipation={0.98}
          velocityDissipation={0.99}
          intensity={0.3}
          rainbow={false}
          blend={0}
          showBackground={true}
          backgroundColor="#a7958b"
          fluidColor="#cfc0a8"
        />
      </EffectComposer>
    </ThreeTunnel.In>
  );
};

export default Example3;