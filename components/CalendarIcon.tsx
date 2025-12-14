import React from 'react';
const { Svg, Path, Circle } = require('react-native-svg');

export function CalendarIcon({ size = 40, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 120" fill="none">
      {/* Marco principal del calendario */}
      <Path
        d="M 20 30 L 80 30 Q 88 30 88 38 L 88 100 Q 88 108 80 108 L 20 108 Q 12 108 12 100 L 12 38 Q 12 30 20 30 Z"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Pin izquierdo */}
      <Circle cx="28" cy="10" r="5" fill={color} />
      <Path
        d="M 28 15 L 28 30"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      {/* Pin derecho */}
      <Circle cx="72" cy="10" r="5" fill={color} />
      <Path
        d="M 72 15 L 72 30"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      {/* Línea horizontal debajo de los pines */}
      <Path
        d="M 12 45 L 88 45"
        stroke={color}
        strokeWidth="2.5"
      />
      
      {/* Grilla de puntos - Fila 1 */}
      <Circle cx="22" cy="58" r="2.5" fill={color} />
      <Circle cx="35" cy="58" r="2.5" fill={color} />
      <Circle cx="48" cy="58" r="2.5" fill={color} />
      <Circle cx="61" cy="58" r="2.5" fill={color} />
      <Circle cx="74" cy="58" r="2.5" fill={color} />
      <Circle cx="87" cy="58" r="2.5" fill={color} />
      
      {/* Grilla de puntos - Fila 2 */}
      <Circle cx="22" cy="72" r="2.5" fill={color} />
      <Circle cx="35" cy="72" r="2.5" fill={color} />
      <Circle cx="48" cy="72" r="2.5" fill={color} />
      <Circle cx="61" cy="72" r="2.5" fill={color} />
      <Circle cx="74" cy="72" r="2.5" fill={color} />
      <Circle cx="87" cy="72" r="2.5" fill={color} />
      
      {/* Grilla de puntos - Fila 3 */}
      <Circle cx="22" cy="86" r="2.5" fill={color} />
      <Circle cx="35" cy="86" r="2.5" fill={color} />
      <Circle cx="48" cy="86" r="2.5" fill={color} />
      <Circle cx="61" cy="86" r="2.5" fill={color} />
      <Circle cx="74" cy="86" r="2.5" fill={color} />
      <Circle cx="87" cy="86" r="2.5" fill={color} />
    </Svg>
  );
}
