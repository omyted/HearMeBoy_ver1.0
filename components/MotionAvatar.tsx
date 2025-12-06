import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { IntentType } from '../types';
import { SPEECHLESS_DICTIONARY } from '../constants';

interface MotionAvatarProps {
  gestureSequence: IntentType[]; // Sequence of intents to perform
  displayText?: string; // Optional custom text to show
  isProcessing?: boolean; // Show analysis state
  language?: 'en' | 'zh';
}

// --- 3D CONSTANTS ---
const JOINT_COLOR = "#EF4444"; // Red for visibility
const BONE_COLOR = "#E2E8F0"; // Slate-200
const SLEEVE_COLOR = "#4F46E5"; // Indigo-600
const ANIMATION_SMOOTHING = 5.0; // Higher = Snappier, Lower = Smoother (Fluidity factor)

// --- RIGGING DATA ---
// Finger Angles: [BaseX, BaseZ, MidX, TipX] (4 angles per finger)
// Fingers: Thumb, Index, Middle, Ring, Pinky
const POSE_DATA: Record<string, number[][]> = {
  NEUTRAL: [
    [0.2, 0.4, 0.1, 0.1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
  ],
  // --- SOCIAL ---
  [IntentType.HELLO]: [ 
     [-0.2, 0.2, 0, 0], [-0.1, 0, 0, 0], [-0.1, 0, 0, 0], [-0.1, 0, 0, 0], [-0.1, 0, 0, 0]
  ],
  [IntentType.THANKS]: [ // Flat hand
     [0, 0.2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
  ],
  [IntentType.PLEASE]: [ // Flat hand (chest circle)
     [0, 0.2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
  ],
  [IntentType.SORRY]: [ // 'A' hand (fist)
     [0.5, 0.2, 0.5, 0.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],

  // --- PRONOUNS ---
  [IntentType.I]: [ // Point to self 
     [1.0, 0.5, 0.5, 0.5], [0.5, 0, 1.5, 1.0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.YOU]: [ // Point Forward
     [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.WE]: [ // W hand / Index Circle
     [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  
  // --- VERBS ---
  [IntentType.WANT]: [ // Claw
     [0.5, 0.5, 0.2, 0.2], [0.5, 0, 0.8, 0.5], [0.5, 0, 0.8, 0.5], [0.5, 0, 0.8, 0.5], [0.5, 0, 0.8, 0.5]
  ],
  [IntentType.NEED]: [ // Hook Finger 'X' shape
     [1.0, 0.5, 0.5, 0.5], [0.8, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.LIKE]: [ // 8 Hand (Thumb + Middle open)
     [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.LOVE]: [ // S hand (Fist) cross chest
     [0.5, 0.2, 0.5, 0.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.SEE]: [ // V hand
     [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.GO]: [ // Point forward
     [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.STOP]: [ // Open Palm Vertical (Paper)
     [0, 0.8, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
  ],
  [IntentType.HELP]: [ // Flat hand lifting fist
     [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.DRINK]: [ // Cup hand
     [1.5, 0.5, 0.5, 0.5], [0.3, 0, 0.3, 0.3], [0.3, 0, 0.3, 0.3], [0.3, 0, 0.3, 0.3], [0.3, 0, 0.3, 0.3]
  ],
  [IntentType.THINK]: [ // Index to Head
     [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],

  // --- NOUNS ---
  [IntentType.WATER]: [ // W hand
     [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.FOOD]: [ // Bunch hand
     [0.6, 0.3, 0.4, 0.4], [0.8, 0, 0.5, 0.2], [0.2, 0, 0.2, 0.2], [0.2, 0, 0.2, 0.2], [0.2, 0, 0.2, 0.2]
  ],
  [IntentType.PLAY]: [ // Y hand
    [-0.5, 0.5, -0.2, -0.2], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [-0.2, -0.4, 0, 0]
  ],
  [IntentType.SLEEP]: [ // Flat hands together
    [0, 0.8, 0, 0], [0, 0.1, 0, 0], [0, 0.1, 0, 0], [0, 0.1, 0, 0], [0, 0.1, 0, 0]
  ],
  [IntentType.TOILET]: [ // T hand (Thumb between index/middle)
    [0.5, 0.2, 0.5, 0.5], [0.8, 0, 1.2, 0.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.HOME]: [ // O hand (Kiss)
    [0.6, 0.3, 0.4, 0.4], [0.8, 0, 0.5, 0.2], [0.8, 0, 0.5, 0.2], [0.8, 0, 0.5, 0.2], [0.8, 0, 0.5, 0.2]
  ],
  [IntentType.SCHOOL]: [ // Flat hands
    [0, 0.2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
  ],
  [IntentType.WORK]: [ // S Hand
     [0.5, 0.2, 0.5, 0.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],

  // --- EMOTIONS / ADJ ---
  [IntentType.HAPPY]: [ // Open 5
    [-0.2, 0.2, -0.1, -0.1], [-0.2, 0, 0, 0], [-0.2, 0, 0, 0], [-0.2, 0, 0, 0], [-0.2, 0, 0, 0]
  ],
  [IntentType.SAD]: [ // Drooping 5
    [0.5, 0.2, 0.4, 0.4], [0.3, 0, 0.3, 0.3], [0.3, 0, 0.3, 0.3], [0.3, 0, 0.3, 0.3], [0.3, 0, 0.3, 0.3]
  ],
  [IntentType.YES]: [ // Thumbs Up
    [-0.5, 0.5, -0.2, -0.2], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.NO]: [ // Beak/Pinch or 3-finger
    [1.2, 0.8, 0.5, 0.5], [0, 0, 0.1, 0.1], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  
  // --- QUESTIONS ---
  [IntentType.WHAT]: [ // Open 5 Shake
    [-0.2, 0.2, -0.1, -0.1], [-0.2, 0, 0, 0], [-0.2, 0, 0, 0], [-0.2, 0, 0, 0], [-0.2, 0, 0, 0]
  ],
  [IntentType.WHERE]: [ // Index Wag
     [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.WHO]: [ // Thumb Circle (L shape with thumb wiggle)
    [-0.5, 0.5, -0.2, -0.2], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  [IntentType.WHY]: [ // Y hand to head
    [-0.5, 0.5, -0.2, -0.2], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [-0.2, -0.4, 0, 0]
  ],

  // --- ALPHABET HANDSHAPES (Generic Mappings) ---
  'FIST': [ // A, S, M, N, T
    [0.5, 0.2, 0.5, 0.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  'FLAT': [ // B
    [0, 0.8, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
  ],
  'CUP': [ // C, E
    [1.0, 0.5, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5]
  ],
  'POINT': [ // D, 1
    [0.5, 0.2, 0.5, 0.5], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  'OK': [ // F
     [0.8, 0.5, 0.5, 0.5], [0.8, 0, 1.0, 1.0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
  ],
  'L_SHAPE': [ // L
    [-0.5, 0.5, -0.2, -0.2], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  'O_SHAPE': [ // O
    [0.6, 0.3, 0.4, 0.4], [0.8, 0, 0.5, 0.2], [0.8, 0, 0.5, 0.2], [0.8, 0, 0.5, 0.2], [0.8, 0, 0.5, 0.2]
  ],
  'V_SHAPE': [ // V, 2, K
    [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5]
  ],
  'THREE': [ // W, 3, 6
    [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1.5, 0, 1.5, 1.5]
  ],
  'FOUR': [ // 4
    [1.5, 0.5, 0.5, 0.5], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
  ],
  'PINKY': [ // I, J
    [0.5, 0.2, 0.5, 0.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [1.5, 0, 1.5, 1.5], [0, 0, 0, 0]
  ],
};

// Helper: Map new comprehensive vocabulary to existing skeletal animations
const resolvePose = (intent: string): string => {
    // 1. Direct match
    if (POSE_DATA[intent]) return intent;

    // 2. Semantic Fallbacks (Mapping new vocabulary to existing mechanical poses)
    switch(intent) {
        // --- ALPHABET MAPPING ---
        case IntentType.LETTER_A: case IntentType.LETTER_M: case IntentType.LETTER_N: case IntentType.LETTER_S: case IntentType.LETTER_T:
          return 'FIST';
        case IntentType.LETTER_B: case IntentType.LETTER_H: 
          return 'FLAT';
        case IntentType.LETTER_C: case IntentType.LETTER_E:
          return 'CUP';
        case IntentType.LETTER_D: case IntentType.LETTER_G: case IntentType.LETTER_Z:
          return 'POINT';
        case IntentType.LETTER_F:
          return 'OK';
        case IntentType.LETTER_L: case IntentType.LETTER_P: case IntentType.LETTER_Q:
          return 'L_SHAPE';
        case IntentType.LETTER_O:
          return 'O_SHAPE';
        case IntentType.LETTER_K: case IntentType.LETTER_V: case IntentType.LETTER_U: case IntentType.LETTER_R:
          return 'V_SHAPE';
        case IntentType.LETTER_W:
          return 'THREE';
        case IntentType.LETTER_I: case IntentType.LETTER_J:
          return 'PINKY';
        case IntentType.LETTER_Y:
          return IntentType.PLAY; // Y Shape
        case IntentType.LETTER_X:
          return IntentType.NEED; // Hook

        // --- NUMBERS MAPPING ---
        case IntentType.NUM_1: return 'POINT';
        case IntentType.NUM_2: return 'V_SHAPE';
        case IntentType.NUM_3: return 'THREE'; // Thumb out 3 usually, but 3 fingers up works
        case IntentType.NUM_4: return 'FOUR';
        case IntentType.NUM_5: return IntentType.HELLO; // Open 5
        case IntentType.NUM_6: return 'THREE'; // W-like
        case IntentType.NUM_7: return 'THREE'; // Approx
        case IntentType.NUM_8: return 'V_SHAPE'; // Approx
        case IntentType.NUM_9: return 'OK'; // F-like
        case IntentType.NUM_10: return IntentType.YES; // Thumbs up shake

        // --- EMERGENCY ---
        case IntentType.EMERGENCY: return IntentType.HELLO; // Wave
        case IntentType.HOSPITAL: return 'FLAT'; // H on shoulder
        case IntentType.AMBULANCE: return 'O_SHAPE'; // Spin
        case IntentType.POLICE: return 'CUP'; // C shape badge
        case IntentType.FIRE: return IntentType.HELLO; // Wiggle
        case IntentType.DOCTOR: return IntentType.WORK; // Wrist
        case IntentType.NURSE: return 'V_SHAPE'; // N wrist
        case IntentType.PAIN: return 'POINT'; // Touch
        case IntentType.MEDICINE: return 'PINKY'; // Pill
        case IntentType.SICK: return 'PINKY'; // Middle finger

        // Time maps to Time/Watch tap or simple point
        case IntentType.TIME: return IntentType.WORK; // Tap wrist
        case IntentType.NOW: return IntentType.TODAY; // Y hands
        case IntentType.TODAY: return IntentType.NOW;
        case IntentType.LATER: return 'L_SHAPE'; // L-handish
        case IntentType.TOMORROW: return IntentType.YOU; // Forward
        case IntentType.YESTERDAY: return IntentType.YES; // Thumb back (approx)
        case IntentType.FUTURE: return 'FLAT'; // Forward
        case IntentType.PAST: return 'FLAT'; // Back
        
        // Family maps to positions (Chin/Head) + Handshapes
        case IntentType.MOTHER: return IntentType.FOOD; // Chin
        case IntentType.FATHER: return IntentType.THINK; // Head
        case IntentType.FAMILY: return 'OK'; // F-shape
        case IntentType.FRIEND: return IntentType.HELP; // Link
        case IntentType.BABY: return 'FLAT'; // Rock
        case IntentType.MAN: return 'FLAT';
        case IntentType.WOMAN: return 'FLAT';

        // Verbs
        case IntentType.EAT: return IntentType.FOOD;
        case IntentType.DRINK: return IntentType.DRINK;
        case IntentType.KNOW: return IntentType.THINK;
        case IntentType.FEEL: return IntentType.I;
        case IntentType.UNDERSTAND: return 'FIST'; // Flick up
        case IntentType.EXPLAIN: return 'OK'; // F-hands
        case IntentType.REMEMBER: return 'FIST'; // Thumb
        case IntentType.FORGET: return 'FLAT'; // Wipe
        case IntentType.MAKE: return 'FIST'; // Twist
        case IntentType.USE: return 'V_SHAPE'; // U-hand
        
        // Adjectives
        case IntentType.GOOD: return IntentType.THANKS;
        case IntentType.BAD: return IntentType.STOP;
        case IntentType.HOT: return IntentType.WANT; // Claw
        case IntentType.COLD: return IntentType.WORK; // Fists
        case IntentType.BIG: return IntentType.WHAT; // Wide
        case IntentType.SMALL: return IntentType.FOOD; // Close
        case IntentType.CONFUSED: return IntentType.WHY;
        case IntentType.FRUSTRATED: return IntentType.STOP;
        case IntentType.PROUD: return IntentType.I;
        case IntentType.EXCITED: return IntentType.HAPPY;
        case IntentType.BORED: return IntentType.TIRED;
        case IntentType.SAME: return IntentType.PLAY; // Y-hand
        case IntentType.DIFFERENT: return 'POINT'; // Cross
        
        // People
        case IntentType.THEY: return IntentType.YOU;
        case IntentType.MY: return IntentType.I;
        case IntentType.YOUR: return IntentType.YOU;

        // Connectors
        case IntentType.AND: return 'FLAT';
        case IntentType.BUT: return 'POINT';
        case IntentType.BECAUSE: return 'POINT';
        case IntentType.OR: return 'L_SHAPE';

        default: return 'NEUTRAL';
    }
};


// --- COMPONENT: BONE SEGMENT ---
const BoneSegment: React.FC<{ length: number; radius: number; color: string }> = ({ length, radius, color }) => {
  return (
    <mesh position={[0, length / 2, 0]}>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
};

// --- COMPONENT: JOINT ---
const JointSphere: React.FC<{ radius: number; color: string }> = ({ radius, color }) => {
  return (
    <mesh>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  );
};

// --- COMPONENT: FINGER CHAIN ---
interface FingerProps {
  idx: number;
  targetAngles: number[];
  lengths: [number, number, number];
  basePos: [number, number, number];
  speedMultiplier: number;
}

const Finger: React.FC<FingerProps> = ({ idx, targetAngles, lengths, basePos, speedMultiplier }) => {
  const groupRef = useRef<THREE.Group>(null);
  const midRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !midRef.current || !topRef.current) return;
    
    if (speedMultiplier === 0) return;

    // Fluid interpolation using independent decay
    // Formula: current = lerp(current, target, 1 - exp(-lambda * dt))
    const alpha = 1 - Math.exp(-ANIMATION_SMOOTHING * speedMultiplier * delta);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetAngles[0], alpha);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetAngles[1], alpha);
    midRef.current.rotation.x = THREE.MathUtils.lerp(midRef.current.rotation.x, targetAngles[2], alpha);
    topRef.current.rotation.x = THREE.MathUtils.lerp(topRef.current.rotation.x, targetAngles[3], alpha);
  });

  return (
    <group position={new THREE.Vector3(...basePos)} ref={groupRef}>
      <JointSphere radius={0.3} color={JOINT_COLOR} />
      <BoneSegment length={lengths[0]} radius={0.25} color={BONE_COLOR} />
      <group position={[0, lengths[0], 0]} ref={midRef}>
        <JointSphere radius={0.25} color={JOINT_COLOR} />
        <BoneSegment length={lengths[1]} radius={0.22} color={BONE_COLOR} />
        <group position={[0, lengths[1], 0]} ref={topRef}>
           <JointSphere radius={0.2} color={JOINT_COLOR} />
           <BoneSegment length={lengths[2]} radius={0.2} color={BONE_COLOR} />
           <mesh position={[0, lengths[2], 0]}>
             <sphereGeometry args={[0.2, 16, 16]} />
             <meshStandardMaterial color={BONE_COLOR} />
           </mesh>
        </group>
      </group>
    </group>
  );
};

// --- COMPONENT: RIGGED HAND ---
const RiggedHand: React.FC<{ 
  currentPoseKey: string; 
  speedMultiplier: number; 
  isTransitioning: boolean;
  side: 'left' | 'right';
}> = ({ currentPoseKey, speedMultiplier, isTransitioning, side }) => {
  const handRef = useRef<THREE.Group>(null);
  const localTime = useRef(0); // Accumulate time for continuous procedural animation
  
  // Use the resolver to find the best matching animation data
  const resolvedPoseKey = resolvePose(currentPoseKey);
  const targetPose = POSE_DATA[resolvedPoseKey] || POSE_DATA.NEUTRAL;
  
  useFrame((state, delta) => {
    if (!handRef.current) return;
    
    // Accumulate time strictly based on playback speed to prevent phase jumps
    localTime.current += delta * speedMultiplier;
    const t = localTime.current;
    
    // Gentle Floating
    handRef.current.position.y = Math.sin(t * 0.5) * 0.05 - 1.5; 
    
    // Procedural Wrist Animation based on Pose
    let targetRotZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    // Custom wrist animations for specific meanings
    if (resolvedPoseKey === IntentType.HELLO || resolvedPoseKey === IntentType.WHAT) targetRotZ = Math.sin(t * 10) * 0.2;
    if (resolvedPoseKey === IntentType.NO || resolvedPoseKey === IntentType.WHERE) targetRotZ = Math.sin(t * 15) * 0.2;
    if (resolvedPoseKey === IntentType.PLAY || resolvedPoseKey === IntentType.TOILET) targetRotZ = Math.sin(t * 10) * 0.3;
    if (resolvedPoseKey === IntentType.WANT || resolvedPoseKey === IntentType.HOT) targetRotX = Math.sin(t * 5) * 0.2;
    if (resolvedPoseKey === IntentType.I || resolvedPoseKey === IntentType.PLEASE) { targetRotX = 0.5; targetRotZ = -0.2; }
    if (resolvedPoseKey === IntentType.THANKS || resolvedPoseKey === IntentType.GOOD || resolvedPoseKey === IntentType.BAD) { 
        targetRotX = Math.sin(t * 5) * 0.3 + 0.5; 
    }
    if (resolvedPoseKey === IntentType.COLD || resolvedPoseKey === IntentType.WORK) {
       targetRotX = Math.sin(t * 20) * 0.05; 
    }

    // Flip bad/stop hands
    if (resolvedPoseKey === IntentType.BAD || resolvedPoseKey === IntentType.STOP) {
       targetRotX += 0.5;
    }

    // Thinking/Head signs
    if (resolvedPoseKey === IntentType.THINK || resolvedPoseKey === IntentType.KNOW) {
        targetRotX = 0.4;
        targetRotY = 0.2;
    }
    
    // Emergency Waving
    if (resolvedPoseKey === IntentType.EMERGENCY || resolvedPoseKey === IntentType.FIRE) {
        targetRotZ = Math.sin(t * 20) * 0.4;
    }

    // Unified Smoothing for wrist/arm to match fingers
    // Note: Wrist should track slightly slower than fingers for natural drag
    const alpha = 1 - Math.exp(-(ANIMATION_SMOOTHING * 0.8) * speedMultiplier * delta);

    if (speedMultiplier > 0) {
        handRef.current.rotation.z = THREE.MathUtils.lerp(handRef.current.rotation.z, targetRotZ, alpha);
        handRef.current.rotation.x = THREE.MathUtils.lerp(handRef.current.rotation.x, targetRotX, alpha);
        handRef.current.rotation.y = THREE.MathUtils.lerp(handRef.current.rotation.y, targetRotY, alpha);
    }
  });

  const fingers = [
    { type: 'Thumb',  pos: [0.8, 0.2, 0.5],   lengths: [1.0, 0.8, 0.6] },
    { type: 'Index',  pos: [0.5, 1.2, 0],     lengths: [1.2, 0.9, 0.7] },
    { type: 'Middle', pos: [0, 1.3, 0],       lengths: [1.3, 1.0, 0.8] },
    { type: 'Ring',   pos: [-0.5, 1.2, 0],    lengths: [1.1, 0.9, 0.7] },
    { type: 'Pinky',  pos: [-0.9, 1.0, 0],    lengths: [0.9, 0.7, 0.6] },
  ];

  // Mirroring logic for Left Hand: Scale X by -1
  const scale: [number, number, number] = side === 'left' ? [-1, 1, 1] : [1, 1, 1];

  return (
    <group scale={scale} ref={handRef}>
      <group position={[0, -2, 0]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[1.1, 1.3, 2.5, 32]} />
          <meshStandardMaterial color={SLEEVE_COLOR} />
        </mesh>
      </group>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]} scale={[1, 1, 0.4]}>
          <boxGeometry args={[2.2, 2.0, 1]} />
          <meshStandardMaterial color={BONE_COLOR} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.5, 0.21]}>
           <boxGeometry args={[1.8, 1.6, 0.05]} />
           <meshStandardMaterial color={JOINT_COLOR} opacity={0.3} transparent />
        </mesh>
        {fingers.map((f, i) => (
          <Finger 
            key={i} 
            idx={i} 
            basePos={f.pos as [number, number, number]} 
            lengths={f.lengths as [number, number, number]}
            targetAngles={targetPose[i]}
            speedMultiplier={speedMultiplier}
          />
        ))}
      </group>
    </group>
  );
};

const MotionAvatar: React.FC<MotionAvatarProps> = ({ gestureSequence, displayText, isProcessing, language }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  
  // Sequence State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPose, setCurrentPose] = useState('NEUTRAL');
  const [currentLabel, setCurrentLabel] = useState('Ready');

  // Logic: Sequence Playback
  useEffect(() => {
    if (!gestureSequence || gestureSequence.length === 0) {
      setCurrentPose('NEUTRAL');
      setCurrentLabel(isProcessing ? (language === 'zh' ? '分析中...' : 'Analyzing...') : (language === 'zh' ? '準備就緒' : 'Ready'));
      return;
    }

    // Reset when sequence changes
    setCurrentIndex(0);
    setIsPlaying(true);
  }, [gestureSequence, isProcessing, language]);

  useEffect(() => {
    if (!isPlaying || !gestureSequence || gestureSequence.length === 0) return;

    const pose = gestureSequence[currentIndex];
    setCurrentPose(pose);
    
    // If displayText is provided and we are animating, maybe show that? 
    // Or show the label of the current sign
    const item = SPEECHLESS_DICTIONARY[pose as IntentType];
    const signLabel = (language === 'zh' && item?.label_zh) ? item.label_zh : (item?.label || pose);
    setCurrentLabel(signLabel);

    const timer = setTimeout(() => {
        if (currentIndex < gestureSequence.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Loop with a pause
            setTimeout(() => {
                setCurrentIndex(0);
            }, 1500); 
        }
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [currentIndex, gestureSequence, isPlaying, speed, language]);


  const speedMultiplier = !isPlaying ? 0 : speed;

  return (
    <div className="w-full h-full bg-slate-100 rounded-3xl border border-slate-200 flex flex-col items-center justify-end overflow-hidden shadow-sm relative group">
      
      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [0, 0, 9], fov: 45 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} shadow-mapSize={1024} castShadow />
        
        <Float speed={1 * speedMultiplier} rotationIntensity={0.1} floatIntensity={0.2}>
           {/* Container for Both Hands centered */}
           <group position={[0, -0.5, 0]}>
             {/* Right Hand */}
             <group position={[2.2, 0, 0]}>
               <RiggedHand 
                 side="right"
                 currentPoseKey={currentPose} 
                 speedMultiplier={speedMultiplier} 
                 isTransitioning={false}
               />
             </group>
             {/* Left Hand (Mirrored) */}
             <group position={[-2.2, 0, 0]}>
               <RiggedHand 
                 side="left"
                 currentPoseKey={currentPose} 
                 speedMultiplier={speedMultiplier} 
                 isTransitioning={false}
               />
             </group>
           </group>
        </Float>
        
        <ContactShadows position={[0, -4, 0]} opacity={0.3} scale={12} blur={2.5} far={4} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/1.5} />
      </Canvas>

      {/* Processing State Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="relative">
                 <div className="w-12 h-12 border-4 border-med-primary/30 border-t-med-primary rounded-full animate-spin"></div>
                 <Sparkles className="w-5 h-5 text-med-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
             </div>
             <p className="mt-4 text-sm font-bold text-med-primary uppercase tracking-wider animate-pulse">
                {language === 'zh' ? '分析語意中...' : 'Analyzing Meaning...'}
             </p>
        </div>
      )}

      {/* Dynamic Subtitle */}
      {!isProcessing && (
        <div className="absolute top-6 left-0 right-0 text-center pointer-events-none z-10">
            <div className="inline-flex flex-col items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {language === 'zh' ? '視覺化動作' : 'Visualizing Action'}
                </span>
                <span className={`bg-med-dark text-white px-6 py-2 rounded-xl font-bold text-xl shadow-lg transition-all duration-300 ${gestureSequence.length > 0 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                {currentLabel}
                </span>
                {displayText && gestureSequence.length > 0 && (
                    <div className="mt-2 px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm max-w-[280px] md:max-w-md text-center animate-in fade-in slide-in-from-top-1">
                        <p className="text-sm font-semibold text-slate-700 leading-snug">
                            {displayText}
                        </p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between z-10">
        
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
             <button 
                onClick={() => setSpeed(0.5)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${speed === 0.5 ? 'bg-white shadow text-med-primary' : 'text-slate-500 hover:text-slate-700'}`}
             >
                0.5x
             </button>
             <button 
                onClick={() => setSpeed(1.0)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${speed === 1.0 ? 'bg-white shadow text-med-primary' : 'text-slate-500 hover:text-slate-700'}`}
             >
                1.0x
             </button>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center bg-med-dark text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm"
            >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            
            <button 
                onClick={() => { setCurrentIndex(0); setIsPlaying(true); }}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
            >
                <RotateCcw size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MotionAvatar;